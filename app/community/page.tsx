"use client";
import React from "react";
import CommunityCard from "../../components/community-card";
import Card from "../../components/ui/card";

export default function Community() {
  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Community</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-4">
            <div className="flex items-center gap-3">
              <input placeholder="Share your achievement..." className="form-field w-full" />
              <button className="btn-pill">Post Achievement</button>
            </div>
          </Card>

          <CommunityCard name="Chakshu Madan" tag="Running" time="2 hours ago" text="Just completed a half marathon in 1 hour 5 min! New personal record 🏅" accent="#3b82f6" />
          <CommunityCard name="Arpit Patni" tag="Gym" time="4 hours ago" text="Hit a personal record: 30 lb deadlift! Finally achieved my goal 💪" accent="#ef4444" />
          <CommunityCard name="Mehul Srivastava" tag="Yoga" time="1 day ago" text="Completed 3-day yoga challenge! Feeling amazing and more flexible than ever ✨" accent="#8b5cf6" />
        </div>

        <div>
          <Card className="mb-4">
            <div className="text-sm font-medium">Community Stats</div>
            <div className="mt-3 text-2xl font-bold">3</div>
            <div className="text-xs text-muted-foreground mt-1">Active Members</div>
          </Card>

          <Card className="mb-4">
            <div className="text-sm font-medium">Trending Now</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Marathon Training — 1 posts</li>
              <li>Fitness Goals — 1 posts</li>
              <li>Yoga Journey — 1 posts</li>
            </ul>
          </Card>

          <Card className="p-4">
            <div className="text-sm font-medium">Invite Friends</div>
            <div className="mt-3">
              <button className="btn-pill w-full">Get Invite Link</button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
