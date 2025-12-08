// components/profile-banner.tsx
"use client";

import React from "react";
import Logo from "./ui/logo";

interface ProfileBannerProps {
  name: string;
  subtitle: string;
  avatar?: string; // URL
}

export default function ProfileBanner({
  name,
  subtitle,
  avatar,
}: ProfileBannerProps) {
  return (
    <section className="w-full rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 p-6 md:p-8 shadow-2xl flex items-center gap-4 md:gap-6">
      <div className="relative">
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-[6px] border-white shadow-2xl overflow-hidden flex items-center justify-center bg-white/10">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-[70%] h-[70%] rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur">
              <Logo size={40} />
            </div>
          )}
        </div>
      </div>

      <div className="text-white">
        <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">
          {name}
        </h1>
        <p className="mt-1 text-sm md:text-base text-white/80">{subtitle}</p>
      </div>
    </section>
  );
}
