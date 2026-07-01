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

export function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    name: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (form.username.length < 2) next.username = "Username must be at least 2 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email";
    if (form.name.length < 1) next.name = "Display name is required";
    if (form.password.length < 8) next.password = "Password must be at least 8 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      toast.success("Account created! Signing you in...");

      const result = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (result?.error) {
        router.push("/login");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
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
          <h2 className="mb-4 text-4xl font-bold text-white">
            Create your link-in-bio page
          </h2>
          <p className="text-lg text-white/80">
            Share all your links, socials, and content in one beautiful page.
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
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription className="text-zinc-400">
              Enter your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-zinc-300">
                  Display name
                </Label>
                <Input
                  id="name"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500"
                />
                {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-zinc-300">
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="janesmith"
                  value={form.username}
                  onChange={(e) => handleChange("username", e.target.value.toLowerCase())}
                  className="border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500"
                />
                {errors.username && <p className="text-xs text-red-400">{errors.username}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500"
                />
                {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500"
                />
                {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#f4256f] hover:bg-[#d91d5c]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-400">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-[#f4256f] hover:underline">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
