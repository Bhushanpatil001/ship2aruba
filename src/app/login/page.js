"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Box, Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        
        if (session?.user?.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/client/dashboard");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 relative transition-colors duration-300">
      <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-card p-10 shadow-2xl shadow-primary/5 border border-border animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
            <Box size={40} />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
            Portal Access
          </h2>
          <p className="mt-2 text-sm text-muted">
            Manage your Aruba shipments and logistics.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl bg-rose-500/10 p-4 text-sm text-rose-600 border border-rose-500/20 flex items-center gap-3">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80 pl-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  className="block w-full rounded-xl border border-border bg-background py-3.5 pl-11 pr-4 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all sm:text-sm"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80 pl-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  className="block w-full rounded-xl border border-border bg-background py-3.5 pl-11 pr-4 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all sm:text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Access Account"
            )}
          </button>
        </form>

        <div className="text-center text-xs text-muted border-t border-border pt-8">
          <p>© 2026 Ship2Aruba Logistics. Fast, Reliable, Secure.</p>
        </div>
      </div>
    </div>
  );
}
