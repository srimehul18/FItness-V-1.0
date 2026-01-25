// components/navigation.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Menu, X } from "lucide-react";
import Logo from "./ui/logo";
import { supabase } from "../lib/supabaseClient";
import ThemeToggle from "./theme-toggle";

<button
  onClick={() => document.documentElement.classList.toggle("dark")}
  className="px-3 py-2 rounded-full bg-blue-500 text-white text-sm"
>
  🌙
</button>


const NAV_ITEMS: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/log-workout", label: "Log" },
  { href: "/progress", label: "Progress" },
  { href: "/community", label: "Community" },
  { href: "/profile", label: "Profile" },
];

export default function Navigation(): JSX.Element {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Watch auth state
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setMobileOpen(false);
    router.replace("/login");
  }

  const desktopLinkClass = (active: boolean) =>
    "px-3 py-2 rounded-full text-sm transition-all duration-200 " +
    (active
      ? "bg-white text-blue-600 shadow-sm"
      : "text-gray-600 hover:text-blue-600 hover:bg-white/70");

  const mobileLinkClass = (active: boolean) =>
    "w-full text-left px-4 py-2 rounded-xl text-sm transition-colors " +
    (active
      ? "bg-blue-50 text-blue-600"
      : "text-gray-700 hover:bg-gray-100");

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-white/80 backdrop-blur-lg shadow-[0_2px_8px_rgba(0,0,0,0.06)] border-b border-white/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Logo + title */}
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setMobileOpen(false)}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden shadow-md">
            <Logo size={22} />
          </div>
         <div className="flex flex-col leading-tight">
  <span className="font-bold text-base sm:text-lg bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
    AthleteHub
  </span>
  <span className="text-[11px] text-gray-500 hidden sm:block">
    Pro Edition
  </span>
</div>

        </Link>
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-3">
        <ThemeToggle />
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={desktopLinkClass(isActive)}
              >
                {item.label}
              </Link>
            );
          })}

          {!user ? (
            <Link
              href="/login"
              className={
                "px-3 py-2 rounded-full text-sm text-gray-600 bg-white/70 hover:bg-white shadow-sm transition-all " +
                (pathname === "/login" ? "border border-blue-100" : "")
              }
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-full text-sm text-gray-700 bg-white hover:bg-gray-100 shadow-sm transition-all"
            >
              Logout
            </button>
          )}

          <Link
            href="/log-workout"
            className="ml-1 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow hover:from-blue-600 hover:to-blue-700"
          >
            + Log Workout
          </Link>
        </nav>

        {/* Mobile right side: CTA + burger */}
        <div className="flex items-center gap-2 md:hidden">
          {/* small log button on mobile */}
          <Link
            href="/log-workout"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow"
            onClick={() => setMobileOpen(false)}
          >
            + Log
          </Link>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            className="p-2 rounded-full bg-white shadow-sm border border-white/60 text-gray-700"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-lg shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={mobileLinkClass(isActive)}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}

            {!user ? (
              <Link
                href="/login"
                className={mobileLinkClass(pathname === "/login")}
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 rounded-xl text-sm text-gray-700 bg-gray-50 hover:bg-gray-100"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
