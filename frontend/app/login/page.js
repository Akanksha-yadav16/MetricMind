"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    // MetricMind login credentials
    const validEmail = "admin123";
    const validPassword = "admin123";

    if (email === validEmail && password === validPassword) {
      // Store login status
      localStorage.setItem("metricmind_logged_in", "true");

      if (rememberMe) {
        localStorage.setItem("metricmind_remember", "true");
      }

      // Go to dashboard
      router.push("/dashboard");
    } else {
      setError("Invalid email or password.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        {/* LOGO / BRAND */}

        <div className="text-center mb-8">

          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-400 shadow-lg shadow-cyan-500/20">

            <div className="flex items-end gap-1.5">
              <span className="h-7 w-2 rounded-sm bg-gray-950"></span>
              <span className="h-10 w-2 rounded-sm bg-gray-950"></span>
              <span className="h-14 w-2 rounded-sm bg-gray-950"></span>
            </div>

          </div>

          <h1 className="text-4xl font-bold text-white">
            MetricMind
          </h1>

          <p className="mt-2 text-cyan-300 font-medium">
            Business Analytics Platform
          </p>

        </div>


        {/* LOGIN CARD */}

        <div className="rounded-3xl border border-gray-700 bg-gray-900/95 p-7 shadow-2xl">

          <div className="mb-7">

            <h2 className="text-2xl font-bold text-white">
              Welcome back
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Sign in to access your analytics dashboard.
            </p>

          </div>


          <form onSubmit={handleLogin} className="space-y-5">

            {/* EMAIL */}

            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-200"
              >
                Email Address
              </label>

              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="username"
                required
                className="w-full rounded-xl border border-gray-600 bg-gray-800 px-4 py-3.5 text-white placeholder-gray-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />

            </div>


            {/* PASSWORD */}

            <div>

              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-200"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-gray-600 bg-gray-800 px-4 py-3.5 text-white placeholder-gray-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />

            </div>


            {/* REMEMBER ME */}

            <div className="flex items-center">

              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-400"
              />

              <label
                htmlFor="remember"
                className="ml-2 text-sm text-gray-300"
              >
                Remember me
              </label>

            </div>


            {/* ERROR */}

            {error && (
              <div className="rounded-xl border border-red-800 bg-red-950/40 px-4 py-3 text-sm font-medium text-red-400">
                {error}
              </div>
            )}


            {/* SIGN IN */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-400 py-3.5 font-bold text-gray-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

        </div>


        {/* FOOTER */}

        <p className="mt-7 text-center text-sm text-gray-500">
          © 2026 MetricMind Analytics Platform
        </p>

      </div>

    </main>
  );
}