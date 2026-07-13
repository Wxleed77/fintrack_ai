"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TrendingUp, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-page)]">
      <div className="w-full max-w-sm animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500 mb-4">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-display font-bold text-[var(--text-primary)]">Welcome back</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="card p-6 space-y-5">
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm rounded-xl px-4 py-3 animate-slide-down">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--text-secondary)]">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="input"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--text-secondary)]">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-emerald-500 font-medium hover:text-emerald-600 transition-colors">
                Register
              </Link>
            </p>
          </div>

          <div className="pt-3 border-t border-[var(--border-card)]">
            <p className="text-xs text-center text-[var(--text-tertiary)]">
              Demo: demo@fintrack.ai / password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}