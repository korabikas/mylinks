"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Link as LinkModel, User } from "@prisma/client";
import * as LucideIcons from "lucide-react";
import {
  Home,
  Bookmark,
  Bell,
  MessageSquare,
  Heart,
  QrCode,
  MoreVertical,
  ChevronUp,
  ChevronDown,
  Plus,
  LogIn,
} from "lucide-react";

interface ProfileViewProps {
  user: Omit<User, "password" | "fullName"> & { links: LinkModel[] };
  isOwner?: boolean;
  isAuthenticated?: boolean;
}

function getIcon(name?: string | null) {
  if (!name) return null;
  const icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  return icon || null;
}

export function ProfileView({ user, isOwner, isAuthenticated }: ProfileViewProps) {
  const [showAdult, setShowAdult] = useState(false);
  const [clickedId, setClickedId] = useState<string | null>(null);
  const accentColor = "#f4256f";

  const allLinks = user.links.filter((l) => l.active).sort((a, b) => a.order - b.order);
  const safeLinks = allLinks.filter((l) => !l.nsfw);
  const adultLinks = allLinks.filter((l) => l.nsfw);

  const handleClick = async (linkId: string, url: string) => {
    setClickedId(linkId);
    try {
      await fetch(`/api/links/${linkId}/click`, { method: "POST" });
    } catch {
      // ignore
    }
    setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
      setClickedId(null);
    }, 120);
  };

  const renderLinkIcon = (link: LinkModel) => {
    if (link.coverImage) {
      return (
        <Image
          src={link.coverImage}
          alt={link.title}
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover"
          unoptimized
        />
      );
    }
    const Icon = getIcon(link.icon);
    if (Icon) {
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
          <Icon className="h-6 w-6" />
        </div>
      );
    }
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-lg font-bold text-zinc-400">
        {link.title.charAt(0).toUpperCase()}
      </div>
    );
  };

  const formatUrl = (url: string) => {
    try {
      const u = new URL(url);
      return (u.hostname + u.pathname).replace(/\/$/, "");
    } catch {
      return url;
    }
  };

  const renderLink = (link: LinkModel) => {
    const shownUrl = link.displayUrl || formatUrl(link.url);
    return (
      <div
        key={link.id}
        className="group flex items-center gap-3 rounded-2xl border border-pink-200 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md"
      >
        {/* Left indicator dot */}
        <div
          className="h-2 w-2 flex-shrink-0 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
        <button
          onClick={() => handleClick(link.id, link.url)}
          className="flex flex-1 items-center gap-4 text-left"
        >
          {renderLinkIcon(link)}
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-zinc-900">{link.title}</p>
            <p className="truncate text-sm" style={{ color: accentColor }}>
              {shownUrl}
            </p>
          </div>
        </button>
        <button
          type="button"
          className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100"
          aria-label="Link options"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-5 w-5" />
        </button>
        {clickedId === link.id && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f3f4f6]">
      {/* Top navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#f4256f]">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          {/* Left nav */}
          <div className="flex items-center gap-6 text-sm font-medium text-white/90">
            <Link href="/" className="flex flex-col items-center gap-0.5 hover:text-white">
              <Home className="h-5 w-5" />
              <span className="text-[10px]">Home</span>
            </Link>
            {isAuthenticated ? (
              <button className="flex flex-col items-center gap-0.5 hover:text-white">
                <Bookmark className="h-5 w-5" />
                <span className="text-[10px]">Bookmarks</span>
              </button>
            ) : (
              <Link
                href="/signup"
                className="flex flex-col items-center gap-0.5 hover:text-white"
              >
                <Bookmark className="h-5 w-5" />
                <span className="text-[10px]">Bookmarks</span>
              </Link>
            )}
            {isAuthenticated ? (
              <button className="flex flex-col items-center gap-0.5 hover:text-white">
                <Bell className="h-5 w-5" />
                <span className="text-[10px]">Notifications</span>
              </button>
            ) : (
              <Link
                href="/signup"
                className="flex flex-col items-center gap-0.5 hover:text-white"
              >
                <Bell className="h-5 w-5" />
                <span className="text-[10px]">Notifications</span>
              </Link>
            )}
            {isAuthenticated ? (
              <button className="flex flex-col items-center gap-0.5 hover:text-white">
                <MessageSquare className="h-5 w-5" />
                <span className="text-[10px]">Messages</span>
              </button>
            ) : (
              <Link
                href="/signup"
                className="flex flex-col items-center gap-0.5 hover:text-white"
              >
                <MessageSquare className="h-5 w-5" />
                <span className="text-[10px]">Messages</span>
              </Link>
            )}
          </div>

          {/* Center logo */}
          <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Heart className="h-8 w-8 fill-white text-white" />
          </Link>

          {/* Right nav */}
          <div className="flex items-center gap-3">
            {isOwner ? (
              <>
                <span className="hidden text-sm text-white sm:inline">{user.username}</span>
                <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-white">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-200 text-xs font-bold text-zinc-500">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-1 rounded-full border border-white/40 bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20"
                >
                  <Plus className="h-4 w-4" />
                  Link
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1 rounded-full border border-white/40 bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20"
              >
                <LogIn className="h-4 w-4" />
                Log in
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Pink header */}
      <div
        className="relative h-48 w-full"
        style={{
          background:
            user.backgroundType === "image" && user.backgroundValue
              ? `url(${user.backgroundValue}) center/cover`
              : `linear-gradient(135deg, ${accentColor} 0%, #ff6b9d 100%)`,
        }}
      />

      {/* Main content */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-16">
        {/* Avatar */}
        <div className="relative -mt-20 mb-4">
          <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg sm:h-40 sm:w-40">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                width={160}
                height={160}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-4xl font-bold text-white"
                style={{ backgroundColor: accentColor }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mb-6 flex items-center justify-end gap-2">
          {isOwner && (
            <Link
              href="/dashboard/profile"
              className="rounded-full px-6 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: accentColor }}
            >
              Manage profile
            </Link>
          )}
          {isAuthenticated ? (
            <button
              className="rounded-full px-6 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: accentColor }}
            >
              Follow
            </button>
          ) : (
            <Link
              href="/signup"
              className="rounded-full px-6 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: accentColor }}
            >
              Follow
            </Link>
          )}
          {isAuthenticated ? (
            <button className="rounded-full border border-zinc-200 bg-white p-2 text-zinc-500 hover:bg-zinc-50">
              <Bell className="h-5 w-5" />
            </button>
          ) : (
            <Link
              href="/signup"
              className="rounded-full border border-zinc-200 bg-white p-2 text-zinc-500 hover:bg-zinc-50"
            >
              <Bell className="h-5 w-5" />
            </Link>
          )}
          {isAuthenticated ? (
            <button className="rounded-full border border-zinc-200 bg-white p-2 text-zinc-500 hover:bg-zinc-50">
              <MoreVertical className="h-5 w-5" />
            </button>
          ) : (
            <Link
              href="/signup"
              className="rounded-full border border-zinc-200 bg-white p-2 text-zinc-500 hover:bg-zinc-50"
            >
              <MoreVertical className="h-5 w-5" />
            </Link>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left profile card */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-zinc-900">{user.name}</h1>
                  <p className="text-zinc-500">@{user.username}</p>
                </div>
                <button className="text-zinc-400 hover:text-zinc-600">
                  <QrCode className="h-6 w-6" />
                </button>
              </div>

              {user.bio && <p className="mb-4 text-sm text-zinc-700">{user.bio}</p>}

              {user.location && (
                <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500">
                  <LucideIcons.MapPin className="h-4 w-4" />
                  <span>{user.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right links */}
          <div className="space-y-3 lg:col-span-3">
            {safeLinks.map(renderLink)}

            {adultLinks.length > 0 && (
              <>
                {!showAdult ? (
                  <button
                    onClick={() => setShowAdult(true)}
                    className="flex w-full flex-col items-center justify-center gap-1 rounded-2xl border border-zinc-200 bg-white py-3 text-sm font-medium text-zinc-500 shadow-sm hover:bg-zinc-50"
                  >
                    <ChevronDown className="h-4 w-4" />
                    Show {adultLinks.length} 18+ links
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setShowAdult(false)}
                      className="flex w-full flex-col items-center justify-center gap-1 rounded-2xl border border-zinc-200 bg-white py-3 text-sm font-medium text-zinc-500 shadow-sm hover:bg-zinc-50"
                    >
                      <ChevronUp className="h-4 w-4" />
                      Hide 18+ links
                    </button>
                    <div className="space-y-3">{adultLinks.map(renderLink)}</div>
                  </>
                )}
              </>
            )}

            {safeLinks.length === 0 && adultLinks.length === 0 && (
              <div className="rounded-2xl border border-pink-200 bg-white p-8 text-center shadow-sm">
                <p className="mb-2 text-lg font-semibold text-zinc-900">No links yet</p>
                <p className="mb-4 text-sm text-zinc-500">
                  {isOwner
                    ? "Start building your page by adding your first link."
                    : "This user hasn't added any links yet."}
                </p>
                {isOwner && (
                  <Link
                    href="/dashboard/profile"
                    className="inline-flex items-center gap-1 rounded-full px-5 py-2 text-sm font-semibold text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Plus className="h-4 w-4" />
                    Add your first link
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-6">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-4 px-4 text-xs text-zinc-500">
          <button className="hover:text-zinc-900">Terms</button>
          <button className="hover:text-zinc-900">Privacy</button>
          <button className="hover:text-zinc-900">Help & Contact</button>
          <Link href="/" className="font-semibold hover:text-zinc-900">
            MyLinks
          </Link>
        </div>
      </footer>
    </div>
  );
}
