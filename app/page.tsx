import Link from "next/link";
import { Heart, Link2, Zap, Users, Shield, Globe } from "lucide-react";

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
            A static link-in-bio page. Users and links are managed in{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 text-sm">data/users.json</code>.
          </p>
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
              description="Add as many links as you want in the JSON file."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-[#f4256f]" />}
              title="Custom themes"
              description="Choose colors, background, avatar, and button style per user."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6 text-[#f4256f]" />}
              title="Multiple profiles"
              description="Add as many users as you want to the users.json file."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6 text-[#f4256f]" />}
              title="Secure by default"
              description="No database or auth to configure. Just static files."
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6 text-[#f4256f]" />}
              title="Fast static pages"
              description="Pre-rendered profiles load instantly on Vercel."
            />
            <FeatureCard
              icon={<Heart className="h-6 w-6 text-[#f4256f]" />}
              title="Built for creators"
              description="Perfect for artists, influencers, and content creators."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} MyLinks. Built for mylinks.love
          </p>
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
