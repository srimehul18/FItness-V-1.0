"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Flame,
  Target,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
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

type Growth =
  | { percent: number; label: string; isPositive: boolean }
  | null;

function formatPercent(p: number) {
  if (!Number.isFinite(p)) return "0%";
  const abs = Math.abs(p);
  return `${p > 0 ? "+" : p < 0 ? "-" : ""}${abs.toFixed(1)}%`;
}

function StatCard({ label, value, gradient, growth, icon }: any) {
  return (
    <div className="rounded-2xl p-5 bg-card border border-border shadow-xl backdrop-blur">
      <div className="flex justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient}`}
        >
          <span className="text-white">{icon}</span>
        </div>

        {growth && (
          <div
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              growth.isPositive
                ? "text-emerald-400 bg-emerald-400/10"
                : "text-rose-400 bg-rose-400/10"
            }`}
          >
            {growth.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {formatPercent(growth.percent)}
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
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
      date: new Date(w.date).toLocaleDateString(undefined, { month: "short" }),
      distance: w.distance ?? 0,
      calories: w.calories ?? 0,
    }));

  const gridColor = "rgba(148,163,184,0.2)"; // soft neon grid

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Your Progress</h1>
            <p className="text-muted-foreground">
              Track growth with neon insights ⚡
            </p>
          </div>

          <Button className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
            <Activity size={16} className="mr-2" />
            Log Workout
          </Button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            label="Total Distance"
            value={`${stats.totalDistance.toFixed(1)} km`}
            gradient="from-blue-500 to-cyan-500"
            icon={<Target size={18} />}
          />

          <StatCard
            label="Calories Burned"
            value={`${Math.round(stats.totalCalories)} kcal`}
            gradient="from-orange-500 to-red-500"
            icon={<Flame size={18} />}
          />

          <StatCard
            label="Total Workouts"
            value={stats.totalWorkouts}
            gradient="from-purple-500 to-pink-500"
            icon={<BarChart3 size={18} />}
          />

          <StatCard
            label="Avg / Week"
            value={`${stats.avgPerWeek.toFixed(1)} km`}
            gradient="from-emerald-500 to-teal-500"
            icon={<Activity size={18} />}
          />
        </div>

        {/* DISTANCE CHART */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-xl">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Distance Growth
          </h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: "#020617",
                    border: "1px solid #38bdf8",
                    borderRadius: 12,
                    color: "#e5e7eb",
                  }}
                />
                <Area
                  dataKey="distance"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  fill="rgba(56,189,248,0.2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LOWER CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-card rounded-2xl p-6 border border-border shadow-xl">
            <h2 className="text-foreground font-semibold mb-3">
              Calories Trend
            </h2>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid stroke={gridColor} />
                  <XAxis dataKey="date" stroke="#94a3b8" />
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

          <div className="bg-card rounded-2xl p-6 border border-border shadow-xl">
            <h2 className="text-foreground font-semibold mb-3">
              Workouts
            </h2>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={chartData}>
                  <CartesianGrid stroke={gridColor} />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: "#020617", color: "#fff" }} />
                  <Bar dataKey="distance" fill="#38bdf8" radius={[6,6,0,0]} />
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
