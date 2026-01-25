"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Flame,
  Target,
  BarChart3,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart as ReBarChart,
  Bar,
} from "recharts";

import { Button } from "../../components/ui/button";
import AuthGuard from "../../components/auth-guard";
import { supabase } from "../../lib/supabaseClient";

type WorkoutRow = {
  id: string;
  date: string;
  distance: number | null;
  calories: number | null;
};

function StatCard({
  label,
  value,
  gradient,
  icon,
}: {
  label: string;
  value: string;
  gradient: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl p-5 bg-[#020617] border border-cyan-500/20 shadow-[0_0_20px_rgba(56,189,248,0.15)]">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} mb-3`}
      >
        <span className="text-white">{icon}</span>
      </div>

      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
  );
}

function ProgressContent() {
  const [workouts, setWorkouts] = useState<WorkoutRow[]>([]);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      setWorkouts((data ?? []) as WorkoutRow[]);
    }

    load();
  }, []);

  const stats = useMemo(() => {
    let totalDistance = 0;
    let totalCalories = 0;

    workouts.forEach(w => {
      totalDistance += w.distance ?? 0;
      totalCalories += w.calories ?? 0;
    });

    return {
      totalDistance,
      totalCalories,
      totalWorkouts: workouts.length,
      avgPerWeek: totalDistance / 4 || 0,
    };
  }, [workouts]);

  const chartData = workouts
    .slice(0, 6)
    .reverse()
    .map(w => ({
      month: new Date(w.date).toLocaleDateString(undefined, { month: "short" }),
      distance: w.distance ?? 0,
      calories: w.calories ?? 0,
    }));

  const grid = "rgba(56,189,248,0.15)";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#020617] to-[#020617] text-white">
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white">Your Progress</h1>
            <p className="text-slate-400">
              Track growth with neon insights ⚡
            </p>
          </div>

          <Button className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(56,189,248,0.6)]">
            <Activity size={16} className="mr-2" />
            Log Workout
          </Button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total Distance"
            value={`${stats.totalDistance.toFixed(1)} km`}
            gradient="from-cyan-400 to-blue-600"
            icon={<Target size={18} />}
          />

          <StatCard
            label="Calories Burned"
            value={`${Math.round(stats.totalCalories)} kcal`}
            gradient="from-orange-400 to-red-500"
            icon={<Flame size={18} />}
          />

          <StatCard
            label="Total Workouts"
            value={stats.totalWorkouts.toString()}
            gradient="from-purple-500 to-pink-500"
            icon={<BarChart3 size={18} />}
          />

          <StatCard
            label="Avg / Week"
            value={`${stats.avgPerWeek.toFixed(1)} km`}
            gradient="from-emerald-400 to-teal-500"
            icon={<Activity size={18} />}
          />
        </div>

        {/* DISTANCE CHART */}
        <div className="bg-[#020617] rounded-2xl p-6 border border-cyan-500/20 shadow-[0_0_30px_rgba(56,189,248,0.15)]">
          <h2 className="text-lg font-semibold mb-4">Distance Growth</h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid stroke={grid} strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: "#020617",
                    border: "1px solid #38bdf8",
                    color: "#fff",
                    borderRadius: 10,
                  }}
                />
                <Area
                  dataKey="distance"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  fill="rgba(56,189,248,0.25)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LOWER CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-[#020617] rounded-2xl p-6 border border-cyan-500/20 shadow-[0_0_30px_rgba(56,189,248,0.15)]">
            <h2 className="font-semibold mb-3">Calories Trend</h2>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid stroke={grid} />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: "#020617", color: "#fff" }} />
                  <Line
                    type="monotone"
                    dataKey="calories"
                    stroke="#fb923c"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#020617] rounded-2xl p-6 border border-cyan-500/20 shadow-[0_0_30px_rgba(56,189,248,0.15)]">
            <h2 className="font-semibold mb-3">Workouts</h2>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={chartData}>
                  <CartesianGrid stroke={grid} />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: "#020617", color: "#fff" }} />
                  <Bar
                    dataKey="distance"
                    fill="#38bdf8"
                    radius={[6, 6, 0, 0]}
                  />
                </ReBarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  return (
    <AuthGuard>
      <ProgressContent />
    </AuthGuard>
  );
}
