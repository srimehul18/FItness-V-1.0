// components/ui/badge.tsx
"use client";

import React from "react";

type BadgeColor = "blue" | "yellow" | "purple" | "pink";

interface BadgeCardProps {
  title: string;
  subtitle: string;
  color: BadgeColor;
  /** when true, badge is greyed out and shows "Locked" */
  locked?: boolean;
}

const COLOR_MAP: Record<
  BadgeColor,
  { gradient: string; shadow: string }
> = {
  blue: {
    gradient: "from-blue-500 to-indigo-500",
    shadow: "shadow-blue-200/60",
  },
  yellow: {
    gradient: "from-amber-400 to-orange-500",
    shadow: "shadow-amber-200/60",
  },
  purple: {
    gradient: "from-violet-500 to-fuchsia-500",
    shadow: "shadow-violet-200/60",
  },
  pink: {
    gradient: "from-rose-500 to-pink-500",
    shadow: "shadow-rose-200/60",
  },
};

export default function BadgeCard({
  title,
  subtitle,
  color,
  locked = false,
}: BadgeCardProps) {
  const theme = COLOR_MAP[color];

  const headerClasses = locked
    ? "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-600"
    : `bg-gradient-to-r ${theme.gradient} text-white`;

  const earnedPillClasses = locked
    ? "bg-white/60 text-gray-600 border-gray-300"
    : "bg-white/15 text-white border-white/60";

  return (
    <div className="rounded-2xl bg-white shadow-lg shadow-black/5 overflow-hidden">
      {/* Top coloured (or greyed) part */}
      <div
        className={`px-5 py-4 flex items-center justify-between ${headerClasses} ${
          locked ? "grayscale" : ""
        }`}
      >
        <div>
          <p className="text-lg font-semibold">{title}</p>
          <p
            className={`text-sm ${
              locked ? "text-gray-700" : "text-white/90"
            }`}
          >
            {subtitle}
          </p>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full border ${earnedPillClasses}`}
        >
          {locked ? "Locked" : "Earned"}
        </span>
      </div>

      {/* Bottom white strip */}
      <div className="px-5 py-3 bg-white text-sm font-medium text-gray-700">
        {locked ? "Locked — keep going!" : "Unlocked"}
      </div>
    </div>
  );
}
