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
  // make sure this matches your column name in Supabase (change if needed)
  date: string;
  distance: number | null;
  calories: number | null;
};

type Growth =
  | {
      percent: number;
      label: string;
      isPositive: boolean;
    }
  | null;

interface StatCardProps {
  label: string;
  value: string;
  gradient: string;
  growth: Growth;
  icon: React.ReactNode;
}

function formatPercent(p: number) {
  if (!Number.isFinite(p)) return "0%";
  const abs = Math.abs(p);
  if (abs >= 100) return `${p > 0 ? "+" : "-"}${abs.toFixed(0)}%`;
  return `${p > 0 ? "+" : p < 0 ? "-" : ""}${abs.toFixed(1)}%`;
}

function StatCard({ label, value, gradient, growth, icon }: StatCardProps) {
  return (
    <div className="rounded-2xl p-5 bg-gradient-to-br from-slate-900/5 to-slate-900/0 shadow-lg border border-white/40 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} shadow-md`}
        >
          <span className="text-white">{icon}</span>
        </div>
        {growth && (
          <div
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
              growth.isPositive
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-rose-500/10 text-rose-500"
            }`}
          >
            {growth.isPositive ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            <span>{formatPercent(growth.percent)}</span>
          </div>
        )}
      </div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      {growth && (
        <p className="mt-1 text-[11px] text-slate-500">{growth.label}</p>
      )}
    </div>
  );
}

function ProgressContent() {
  const [workouts, setWorkouts] = useState<WorkoutRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      // uses the shared supabase client (already authenticated by AuthGuard)
      const {
  data: { user },
  error: userError,
} = await supabase.auth.getUser();

if (userError || !user) {
  throw new Error("Not logged in");
}

const { data, error } = await supabase
  .from("workouts")
  .select("*")
  .eq("user_id", user.id)      // 🔥 filter by user
  .order("date", { ascending: false })
  .limit(50);


      if (error) {
        console.error("Error loading workouts for progress page:", error);
      } else if (data) {
        setWorkouts(data as WorkoutRow[]);
      }
      setLoading(false);
    }

    load();
  }, []);

  const stats = useMemo(() => {
    if (!workouts.length) {
      return {
        totalDistance: 0,
        totalCalories: 0,
        totalWorkouts: 0,
        avgPerWeek: 0,
        monthly: [] as {
          key: string;
          label: string;
          distance: number;
          calories: number;
          count: number;
        }[],
        growthDistance: null as Growth,
        growthCalories: null as Growth,
        growthWorkouts: null as Growth,
        bestMonth: "—",
        bestMonthDistance: 0,
        avgPerWorkout: 0,
        personalBestDistance: 0,
      };
    }

    let totalDistance = 0;
    let totalCalories = 0;
    const monthlyMap = new Map<
      string,
      { label: string; distance: number; calories: number; count: number }
    >();

    let firstDate: Date | null = null;
    let lastDate: Date | null = null;
    let personalBestDistance = 0;

    for (const w of workouts) {
      const distance = w.distance ?? 0;
      const calories = w.calories ?? 0;

      totalDistance += distance;
      totalCalories += calories;
      personalBestDistance = Math.max(personalBestDistance, distance);

      const d = new Date(w.date);
      if (!firstDate || d < firstDate) firstDate = d;
      if (!lastDate || d > lastDate) lastDate = d;

      const year = d.getFullYear();
      const monthIdx = d.getMonth(); // 0..11
      const key = `${year}-${monthIdx}`;
      const label = d.toLocaleDateString(undefined, {
        month: "short",
      });

      const existing = monthlyMap.get(key);
      if (existing) {
        existing.distance += distance;
        existing.calories += calories;
        existing.count += 1;
      } else {
        monthlyMap.set(key, {
          label,
          distance,
          calories,
          count: 1,
        });
      }
    }

    const monthly = Array.from(monthlyMap.entries())
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([key, value]) => ({ key, ...value }))
      .slice(-6); // last 6 months

    const totalWorkouts = workouts.length;

    // --- Growth vs last month ---
    const len = monthly.length;
    const current = len >= 1 ? monthly[len - 1] : null;
    const previous = len >= 2 ? monthly[len - 2] : null;

    const makeGrowth = (
      currentValue: number,
      previousValue: number,
      label: string
    ): Growth => {
      if (!previous) return null;
      const base = previousValue || 1; // avoid /0
      const percent = ((currentValue - previousValue) / base) * 100;
      return {
        percent,
        label,
        isPositive: percent >= 0,
      };
    };

    const growthDistance =
      current && previous
        ? makeGrowth(current.distance, previous.distance, "vs last month")
        : null;
    const growthCalories =
      current && previous
        ? makeGrowth(current.calories, previous.calories, "vs last month")
        : null;
    const growthWorkouts =
      current && previous
        ? makeGrowth(current.count, previous.count, "vs last month")
        : null;

    // --- Avg per week ---
    let avgPerWeek = 0;
    if (firstDate && lastDate) {
      const diffDays =
        (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
      const weeks = Math.max(diffDays / 7, 1);
      avgPerWeek = totalDistance / weeks;
    }

    // --- Insights ---
    let bestMonth = "—";
    let bestMonthDistance = 0;
    for (const m of monthly) {
      if (m.distance > bestMonthDistance) {
        bestMonthDistance = m.distance;
        bestMonth = m.label;
      }
    }

    const avgPerWorkout =
      totalWorkouts > 0 ? totalDistance / totalWorkouts : 0;

    return {
      totalDistance,
      totalCalories,
      totalWorkouts,
      avgPerWeek,
      monthly,
      growthDistance,
      growthCalories,
      growthWorkouts,
      bestMonth,
      bestMonthDistance,
      avgPerWorkout,
      personalBestDistance,
    };
  }, [workouts]);

  const distanceData = stats.monthly.map((m) => ({
    month: m.label,
    distance: Number(m.distance.toFixed(1)),
  }));

  const caloriesData = stats.monthly.map((m) => ({
    month: m.label,
    calories: Math.round(m.calories),
  }));

  const workoutsData = stats.monthly.map((m) => ({
    month: m.label,
    count: m.count,
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
              Your Progress
            </h1>
            <p className="text-slate-500">
              Track your improvement and celebrate milestones.
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg rounded-full px-5"
            size="lg"
          >
            <Activity className="w-4 h-4 mr-2" />
            Log Workout
          </Button>
        </div>

        {/* Top stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            label="Total Distance"
            value={`${stats.totalDistance.toFixed(1)} km`}
            gradient="from-blue-500 to-indigo-500"
            growth={stats.growthDistance}
            icon={<Target className="w-5 h-5" />}
          />
          <StatCard
            label="Calories Burned"
            value={`${Math.round(stats.totalCalories).toLocaleString()} kcal`}
            gradient="from-orange-500 to-red-500"
            growth={stats.growthCalories}
            icon={<Flame className="w-5 h-5" />}
          />
          <StatCard
            label="Total Workouts"
            value={stats.totalWorkouts.toString()}
            gradient="from-purple-500 to-pink-500"
            growth={stats.growthWorkouts}
            icon={<BarChart3 className="w-5 h-5" />}
          />
          <StatCard
            label="Avg. Distance / Week"
            value={`${stats.avgPerWeek.toFixed(1)} km`}
            gradient="from-emerald-500 to-teal-500"
            growth={null}
            icon={<Activity className="w-5 h-5" />}
          />
        </div>

        {/* Big distance chart */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Total Distance (km)
              </h2>
              <p className="text-xs text-slate-500">
                Steady progress towards your goals
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">This period</p>
              <p className="text-lg font-semibold text-slate-900">
                {stats.totalDistance.toFixed(1)} km
              </p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={distanceData}>
                <defs>
                  <linearGradient id="distanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="distance"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fill="url(#distanceGradient)"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lower charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calories chart */}
          <div className="bg-card rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Calories Burned
                </h2>
                <p className="text-xs text-slate-500">Monthly trend</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">This period</p>
                <p className="text-lg font-semibold text-orange-500">
                  {Math.round(stats.totalCalories).toLocaleString()} kcal
                </p>
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={caloriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: 12,
                      border: "1px solid #e5e7eb",
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="calories"
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Workouts per month */}
          <div className="bg-card rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Workouts Per Month
                </h2>
                <p className="text-xs text-slate-500">Consistency tracking</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Total workouts</p>
                <p className="text-lg font-semibold text-purple-500">
                  {stats.totalWorkouts}
                </p>
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={workoutsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: 12,
                      border: "1px solid #e5e7eb",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="#111827" radius={[8, 8, 4, 4]} />
                </ReBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Key insights */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Key Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-blue-50 p-4 border border-blue-100">
              <p className="text-xs font-semibold text-blue-700 mb-1">
                Best Month
              </p>
              <p className="text-lg font-bold text-blue-900">
                {stats.bestMonth}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {stats.bestMonthDistance.toFixed(1)} km in your top month
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-100">
              <p className="text-xs font-semibold text-emerald-700 mb-1">
                Average per Workout
              </p>
              <p className="text-lg font-bold text-emerald-900">
                {stats.avgPerWorkout.toFixed(1)} km
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                Distance covered each session on average
              </p>
            </div>
            <div className="rounded-xl bg-purple-50 p-4 border border-purple-100">
              <p className="text-xs font-semibold text-purple-700 mb-1">
                Personal Best
              </p>
              <p className="text-lg font-bold text-purple-900">
                {stats.personalBestDistance.toFixed(1)} km
              </p>
              <p className="text-xs text-purple-600 mt-1">
                Your longest recorded workout in one session
              </p>
            </div>
          </div>
        </div>

        {loading && (
          <p className="text-xs text-slate-400 text-center">
            Loading your progress…
          </p>
        )}
      </div>
    </div>
  );
}

// 👇 This is what actually gets exported for the /progress route
export default function ProgressPage() {
  return (
    <AuthGuard>
      <ProgressContent />
    </AuthGuard>
  );
}
