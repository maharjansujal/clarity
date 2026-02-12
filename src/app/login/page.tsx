"use client";

import { Mail, Lock, Wallet, Eye, EyeClosed } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  //   Password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError("Wrong email or password");
      return;
    }

    router.push("/");
  }
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:bg-linear-to-br dark:from-slate-900 dark:via-blue-800 dark:to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-linear-to-br from-indigo-500 to-purple-600 mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2 dark:from-white dark:to-slate-100">
            Welcome to Clarity
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Track your finances with crystal clear insights
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 p-8 dark:bg-slate-800 dark:border-slate-700">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-1 dark:text-white">
              Sign In
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Enter your credentials to access your account
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-300" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:focus:ring-indigo-400 transition-all
                  [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset]
                  dark:[&:-webkit-autofill]:shadow-[0_0_0_1000px_#334155_inset] 
                  [&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-slate-900)]
                  dark:[&:-webkit-autofill]:[-webkit-text-fill-color:white]
                  [transition:background-color_9999s_ease-in-out_0s]" //autofill fix
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-300" />
                <input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                 className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:focus:ring-indigo-400 transition-all
                  [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset]
                  dark:[&:-webkit-autofill]:shadow-[0_0_0_1000px_#334155_inset] 
                  [&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-slate-900)]
                  dark:[&:-webkit-autofill]:[-webkit-text-fill-color:white]
                  [transition:background-color_9999s_ease-in-out_0s]"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors dark:text-slate-400 dark:hover:text-slate-300 cursor-pointer"
                  onClick={() => setPasswordVisible((prev) => !prev)}
                  tabIndex={-1} // Prevent focus on the eye button when tabbing through form fields
                >
                  {passwordVisible ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeClosed className="w-5 h-5" />
                  )}
                </button>
              </div>
              {error && <p className="text-red-500">{error}</p>}
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all dark:from-indigo-500 dark:to-purple-600 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium cursor-pointer hover:underline text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-500 transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
