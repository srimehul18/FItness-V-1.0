// components/navigation.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

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
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/25 overflow-hidden">
            <img src="/avatar.jpg" alt="logo" className="w-8 h-8 object-cover rounded-full" />
          </div>
          <div>
            <div className="font-bold text-lg">AthleteHub</div>
            <div className="text-xs text-muted-foreground">Pro Edition</div>
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
                  (isActive
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-muted-foreground hover:bg-white/20")
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
