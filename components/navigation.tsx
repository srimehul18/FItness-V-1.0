// components/navigation.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Logo from "./ui/logo";

const NAV_ITEMS: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/log-workout", label: "Log" },
  { href: "/progress", label: "Progress" },
  { href: "/community", label: "Community" },
  { href: "/profile", label: "Profile" },
];

export default function Navigation(): JSX.Element {
  const pathname = usePathname() || "/";

  return (
    <header className="bg-transparent w-full sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* logo + title */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden shadow-sm">
            {/* use the React SVG Logo component */}
            <Logo size={36} />
          </div>

          <div>
            <div className="font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              AthleteHub
            </div>
            <div className="text-xs text-gray-500">Pro Edition</div>
          </div>
        </Link>

        {/* nav links */}
        <nav className="flex items-center gap-3">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "px-3 py-2 rounded-full text-sm transition-all duration-200 " +
                  (isActive ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:bg-white/10")
                }
              >
                {item.label}
              </Link>
            );
          })}

          {/* a simple call-to-action pill */}
          <Link
            href="/log-workout"
            className="ml-3 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow"
          >
            + Log Workout
          </Link>
        </nav>
      </div>
    </header>
  );
}
