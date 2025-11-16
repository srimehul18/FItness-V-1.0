"use client";

import React, { useState } from "react";
import Logo from "./ui/logo"; // match casing exactly to your file

interface ProfileBannerProps {
  name: string;
  subtitle?: string;
  avatar?: string; // optional avatar URL or local path
}

export default function ProfileBanner({ name, subtitle, avatar }: ProfileBannerProps) {
  const [imgError, setImgError] = useState(false);

  // decide whether to show image: avatar provided AND not errored
  const showAvatar = !!avatar && !imgError;

  return (
    <div className="w-full bg-gradient-to-r from-blue-500 to-purple-500 h-44 rounded-b-2xl shadow-md relative">
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-end">
        {/* LEFT: Large circle with logo or provided avatar (with fallback) */}
        <div className="mr-4 -mt-10">
          <div className="w-28 h-28 rounded-full border-4 border-white bg-white/10 flex items-center justify-center shadow-xl overflow-hidden backdrop-blur-sm">
            {showAvatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-24 h-24 object-cover rounded-full"
                onError={() => setImgError(true)}
                // using plain <img> so remote or public images work; next/image adds extra config
              />
            ) : (
              <Logo size={70} />
            )}
          </div>
        </div>

        {/* RIGHT: Name + Subtitle */}
        <div className="text-white">
          <h2 className="text-3xl font-extrabold">{name}</h2>
          {subtitle && <p className="text-sm opacity-90 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
