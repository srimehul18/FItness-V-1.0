// components/ui/badge.tsx
import React from "react";

type BadgeProps = {
  title: string;
  subtitle?: string;
  color?: "blue" | "yellow" | "purple" | "pink" | "green";
};

const GRADIENTS: Record<string, string> = {
  blue: "bg-gradient-to-r from-blue-400 to-blue-600",
  yellow: "bg-gradient-to-r from-yellow-400 to-orange-400",
  purple: "bg-gradient-to-r from-indigo-500 to-purple-500",
  pink: "bg-gradient-to-r from-pink-400 to-rose-500",
  green: "bg-gradient-to-r from-emerald-400 to-green-600",
};

export default function BadgeCard({ title, subtitle = "", color = "blue" }: BadgeProps) {
  const grad = GRADIENTS[color] ?? GRADIENTS.blue;

  return (
    <div className="rounded-xl shadow-2xl overflow-hidden">
      <div className={`p-4 ${grad} text-white`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-semibold leading-snug">{title}</div>
            {subtitle && <div className="text-sm opacity-90 mt-1">{subtitle}</div>}
          </div>
          <div className="ml-auto self-start">
            <span className="inline-block bg-white/20 text-white text-xs px-2 py-1 rounded-full font-medium">Earned</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-3">
        <div className="text-sm text-gray-600">{subtitle ? "Unlocked" : "Unlocked"}</div>
      </div>
    </div>
  );
}
