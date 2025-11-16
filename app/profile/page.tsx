"use client";
import React from "react";
import ProfileBanner from "../../components/profile-banner";
import Card from "../../components/ui/card";
import BadgeCard from "../../components/ui/badge";

export default function Profile() {
  return (
    <main className="max-w-6xl mx-auto p-6">
      <ProfileBanner
        name="Chakshu Madan"
        subtitle="Pro Edition • Sohna Road, Haryana"
        avatar="https://img.freepik.com/premium-vector/stylized-fancy-letter-c-with-leaf-flower-vintage-ornament_267331-473.jpg"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <Card className="mb-4">
            <div className="text-lg font-semibold">Badges & Achievements</div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <BadgeCard title="Century Runner" subtitle="Run 100+ km" color="blue" />
              <BadgeCard title="Consistency King" subtitle="30-day streak" color="yellow" />
              <BadgeCard title="Peak Performance" subtitle="Personal record" color="purple" />
              <BadgeCard title="Social Butterfly" subtitle="50 community posts" color="pink" />
            </div>
          </Card>
        </div>

        <div>
          <Card className="mb-4">
            <div className="text-sm font-medium">Quick Stats</div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="card-sm p-3 text-center">
                Avg Workout
                <div className="font-bold mt-1">48 min</div>
              </div>
              <div className="card-sm p-3 text-center">
                Favorite Sport
                <div className="font-bold mt-1">Running</div>
              </div>
              <div className="card-sm p-3 text-center">
                Community Posts
                <div className="font-bold mt-1">28</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
