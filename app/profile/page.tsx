"use client";
import React from "react";
import ProfileBanner from "../../components/profile-banner";
import Card from "../../components/ui/card";

export default function Profile() {
  return (
    <main className="max-w-6xl mx-auto p-6">
      <ProfileBanner name="Chakshu Madan" subtitle="Pro Edition • Sohna Road, Haryana" avatar="https://img.freepik.com/premium-vector/stylized-fancy-letter-c-with-leaf-flower-vintage-ornament_267331-473.jpg" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-4">
            <div className="text-lg font-semibold">Badges & Achievements</div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card-sm p-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white">Century Runner — Run 100+ km</div>
              <div className="card-sm p-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white">Consistency King — 30-day streak</div>
              <div className="card-sm p-4 bg-gradient-to-r from-purple-400 to-pink-400 text-white">Peak Performance — Personal record</div>
              <div className="card-sm p-4 bg-gradient-to-r from-pink-400 to-violet-400 text-white">Social Butterfly — 50 community posts</div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="mb-4">
            <div className="text-sm font-medium">Quick Stats</div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="card-sm p-3 text-center">Avg Workout<br /><div className="font-bold mt-1">48 min</div></div>
              <div className="card-sm p-3 text-center">Favorite Sport<br /><div className="font-bold mt-1">Running</div></div>
              <div className="card-sm p-3 text-center">Community Posts<br /><div className="font-bold mt-1">28</div></div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
