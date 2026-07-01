"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    const role = session?.user?.role as "ADMIN" | "USER" | undefined;

    router.push(role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen w-full bg-zinc-950">
      {/* Left side - branding */}
      <div
        className="hidden flex-1 flex-col justify-between p-12 lg:flex"
        style={{
          background: "linear-gradient(135deg, #f4256f 0%, #ff6b9d 100%)",
        }}
      >
        <div className="flex items-center gap-2 text-2xl font-bold text-white">
          <Heart className="h-8 w-8 fill-white" />
          MyLinks
        </div>
        <div>
          <h2 className="mb-4 text-4xl font-bold text-white">Welcome back</h2>
          <p className="text-lg text-white/80">
            Log in to manage your profile, links, and audience.
          </p>
        </div>
        <p className="text-sm text-white/60">© {new Date().getFullYear()} MyLinks</p>
      </div>

      {/* Right side - form */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/50 text-zinc-100 shadow-2xl backdrop-blur">
          <CardHeader className="space-y-1">
            <div className="mb-2 flex items-center gap-2 text-xl font-bold text-[#f4256f] lg:hidden">
              <Heart className="h-6 w-6 fill-current" />
              MyLinks
            </div>
            <CardTitle className="text-2xl font-bold">Log in</CardTitle>
            <CardDescription className="text-zinc-400">
              Enter your email and password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-[#f4256f] hover:bg-[#d91d5c]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-400">
              Don't have an account?{" "}
              <Link href="/signup" className="font-medium text-[#f4256f] hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
