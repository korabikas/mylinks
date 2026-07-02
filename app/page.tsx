import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Link2, Lock, Shield, Users, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[#f4256f]">
            <Heart className="h-6 w-6 fill-current" />
            MyLinks
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-zinc-600 hover:text-zinc-900 sm:inline"
            >
              Example
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm" className="border-[#f4256f] text-[#f4256f] hover:bg-[#f4256f]/5">
                Log in
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-16 pb-24 text-center sm:pt-24 sm:pb-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-pink-50 to-white" />
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl">
            All your links in one beautiful page
          </h1>
          <p className="mb-8 text-lg text-zinc-600 sm:text-xl">
            Create your own link-in-bio page, manage unlimited links, customize your
            style, and share everything with your audience.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/admin/dashboard/users/new">
              <Button size="lg" className="bg-[#f4256f] px-8 hover:bg-[#d91d5c]">
                Get started for free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8">
                View example
              </Button>
            </Link>
          </div>

          <div className="mx-auto mt-12 max-w-md rounded-2xl border bg-white p-2 shadow-xl">
            <div className="flex items-center gap-2 rounded-xl bg-zinc-50 p-2">
              <span className="pl-3 text-zinc-400">mylinks.love/</span>
              <Input
                placeholder="yourname"
                className="border-0 bg-transparent focus-visible:ring-0"
              />
              <Button size="sm" className="bg-[#f4256f] hover:bg-[#d91d5c]">
                Claim
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-zinc-900">
            Everything you need
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Link2 className="h-6 w-6 text-[#f4256f]" />}
              title="Unlimited links"
              description="Add as many links as you want and organize them with drag and drop."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-[#f4256f]" />}
              title="Custom themes"
              description="Choose your colors, background, avatar, and button style."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6 text-[#f4256f]" />}
              title="Admin dashboard"
              description="Manage all users and their links from one secure admin panel."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6 text-[#f4256f]" />}
              title="Secure by default"
              description="Role-based access, hashed passwords, and protected admin routes."
            />
            <FeatureCard
              icon={<Lock className="h-6 w-6 text-[#f4256f]" />}
              title="18+ link controls"
              description="Mark adult links and let visitors choose to reveal them."
            />
            <FeatureCard
              icon={<Heart className="h-6 w-6 text-[#f4256f]" />}
              title="Built for creators"
              description="Perfect for artists, influencers, and adult content creators."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-zinc-950 px-4 py-20 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-3xl font-bold">Ready to build your page?</h2>
          <p className="mb-8 text-zinc-400">
            Join MyLinks and share everything you create with the world.
          </p>
          <Link href="/admin">
            <Button size="lg" className="bg-[#f4256f] px-8 hover:bg-[#d91d5c]">
              Create your page
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} MyLinks. Built for mylinks.love
          </p>
          <div className="flex gap-4 text-sm text-zinc-500">
            <Link href="/login" className="hover:text-zinc-900">
              Log in
            </Link>
            <Link href="/login" className="hover:text-zinc-900">
              Example
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 inline-flex rounded-lg bg-pink-50 p-3">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold text-zinc-900">{title}</h3>
      <p className="text-sm text-zinc-600">{description}</p>
    </div>
  );
}
