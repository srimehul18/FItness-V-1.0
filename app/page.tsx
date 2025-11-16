"use client";
import React from "react";
import Card from "../components/ui/card";
import MetricCard from "../components/metric-card";
import ProfileBanner from "../components/profile-banner";
import CommunityCard from "../components/community-card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Button } from "../components/ui/button";

const weeklyData = [
  { name: "Mon", val: 4 },
  { name: "Tue", val: 6 },
  { name: "Wed", val: 4 },
  { name: "Thu", val: 7 },
  { name: "Fri", val: 8 },
  { name: "Sat", val: 10 },
  { name: "Sun", val: 6 }
];

const activity = [
  { name: "Running", value: 35 },
  { name: "Gym", value: 30 },
  { name: "Cycling", value: 20 },
  { name: "Yoga", value: 15 }
];

export default function Page() {
  return (
    <main className="max-w-7xl mx-auto p-6">
      <ProfileBanner name="AthleteHub" subtitle="Pro Edition" avatar="/avatar.jpg" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-extrabold">Welcome Back!</h1>
          <p className="text-sm text-muted-foreground mt-1">You're crushing it! 7-day streak</p>
        </div>
        <div>
          <Button className="btn-pill">+ Log Workout</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <MetricCard title="Total Workouts" value={42} subtitle="+3 this week" accentClass="bg-primary text-white" icon={<div />} />
        <MetricCard title="Current Streak" value="7 days" subtitle="Keep it up!" accentClass="bg-accent text-white" />
        <MetricCard title="This Week" value="48.3 km" subtitle="+12% vs last" accentClass="bg-secondary text-white" />
        <MetricCard title="Calories Burned" value="4,320" subtitle="+8% progress" accentClass="bg-destructive text-white" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 panel">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium">Weekly Performance</div>
            <div className="text-xs text-muted-foreground">Distance tracked daily</div>
          </div>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="val" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="panel">
          <div className="text-sm font-medium mb-2">Activity Breakdown</div>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={activity} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50} paddingAngle={6}>
                  {activity.map((entry, idx) => <Cell key={idx} fill={["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"][idx]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">Recent Activity</div>
          <div className="text-sm text-muted-foreground">Your latest workouts</div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">🏃</div>
              <div>
                <div className="font-semibold">Running</div>
                <div className="text-sm text-muted-foreground">45 min • 8.1 km</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">2 hours ago</div>
          </div>
          <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">🏋️</div>
              <div>
                <div className="font-semibold">Strength Training</div>
                <div className="text-sm text-muted-foreground">60 min • 4 sets</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">1 day ago</div>
          </div>
        </div>
      </Card>
    </main>
  );
}
