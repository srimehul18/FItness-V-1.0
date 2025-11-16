import React from "react";
export default function ProfileBanner({ name = "Chakshu Madan", subtitle = "Pro Edition • Joined Nov 2025", avatar = "/avatar.jpg" }: { name?: string; subtitle?: string; avatar?: string; }) {
  return (
    <div className="rounded-lg mb-6" style={{ background: "linear-gradient(90deg,#3b82f6,#8b5cf6)", padding: 26 }}>
      <div className="flex items-center gap-6 max-w-7xl mx-auto">
        <div style={{ width: 84, height: 84 }} className="rounded-full border-4 border-white overflow-hidden">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="text-3xl font-extrabold text-white">{name}</div>
          <div className="text-sm text-white/90 mt-1">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}
