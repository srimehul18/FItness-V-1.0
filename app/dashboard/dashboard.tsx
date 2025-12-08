// app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Activity,
  Flame,
  Target,
  Trophy,
  Plus,
  TrendingUp,
  Zap,
  Award,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Button } from "../../components/ui/button";
import { supabase } from "../../lib/supabaseClient";
import AuthGuard from "../../components/auth-guard";

type WorkoutRow = {
  id: string;
  sport_type: string;
  date: string;
  duration: number | null;
  distance: number | null;
  calories: number | null;
  notes: string | null;
};

type WeeklyDataPoint = {
  day: string;
  distance: number;
};

type SportSlice = {
  name: string;
  value: number;
  color: string;
};

type RecentItem = {
  id: string;
  type: string;
  duration: string;
  distance: string;
  time: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
};

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
  trend?: string;
}

function StatCard({ label, value, icon, gradient, trend }: StatCardProps) {
  return (
    <div className="bg-card rounded-xl p-6 premium-shadow border border-border/50 animate-slideInUp hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm mb-2 font-medium">
            {label}
          </p>
          <p className="text-3xl font-bold text-foreground text-balance">
            {value}
          </p>
          {trend && (
            <p className="text-xs text-secondary mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {trend}
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${gradient} shadow-lg`}
        >
          <div className="text-white">{icon}</div>
        </div>
      </div>
    </div>
  );
}

// ---------- Helpers ----------

// “How long ago”
function formatRelative(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString();
}

// Normalise a date string to YYYY-MM-DD
function normaliseDate(d: string): string {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Compute ACTIVE streak: consecutive workout days that end on today or yesterday
function computeCurrentStreak(rows: WorkoutRow[]): number {
  if (!rows.length) return 0;

  const uniqueDays = Array.from(
    new Set(
      rows
        .filter((w) => w.date)
        .map((w) => normaliseDate(w.date))
    )
  ).sort();

  if (!uniqueDays.length) return 0;

  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  const todayNorm = normaliseDate(new Date().toISOString());
  const today = new Date(todayNorm);
  const lastDay = new Date(uniqueDays[uniqueDays.length - 1]);

  const diffToToday = Math.round(
    (today.getTime() - lastDay.getTime()) / MS_PER_DAY
  );

  // If last workout is older than yesterday, there is no active streak
  if (diffToToday > 1) {
    return 0;
  }

  let streak = 1;

  for (let i = uniqueDays.length - 1; i > 0; i--) {
    const d1 = new Date(uniqueDays[i]);
    const d0 = new Date(uniqueDays[i - 1]);
    const diffDays = Math.round(
      (d1.getTime() - d0.getTime()) / MS_PER_DAY
    );

    if (diffDays <= 0) {
      // same day or disorder – skip
      continue;
    }
    if (diffDays === 1) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

// -------- MAIN DASHBOARD CONTENT (requires auth) --------

function DashboardContent() {
  const [weeklyData, setWeeklyData] = useState<WeeklyDataPoint[]>([]);
  const [sportDistribution, setSportDistribution] = useState<SportSlice[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentItem[]>([]);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

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
          .eq("user_id", user.id)
          .order("date", { ascending: false })
          .limit(50);

        if (error) throw error;
        const workouts = (data || []) as WorkoutRow[];

        // 🔥 REAL streak
        const streak = computeCurrentStreak(workouts);
        setCurrentStreak(streak);

        // Totals
        setTotalWorkouts(workouts.length);
        const totalDist = workouts.reduce(
          (sum, w) => sum + (w.distance || 0),
          0
        );
        setTotalDistance(totalDist);
        const totalCals = workouts.reduce(
          (sum, w) => sum + (w.calories || 0),
          0
        );
        setCaloriesBurned(totalCals);

        // Weekly performance (last 7 days)
        const now = new Date();
        const sevenDaysAgo = new Date(
          now.getTime() - 7 * 24 * 60 * 60 * 1000
        );

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const map: Record<string, number> = {};
        days.forEach((d) => (map[d] = 0));

        workouts.forEach((w) => {
          const d = new Date(w.date);
          if (d >= sevenDaysAgo && d <= now) {
            const label = days[d.getDay()];
            map[label] += w.distance || 0;
          }
        });

        setWeeklyData(
          days.map((d) => ({
            day: d,
            distance: Number(map[d].toFixed(1)),
          }))
        );

        // Sport distribution
        const colors = [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#8b5cf6",
          "#ef4444",
        ];
        const sportMap: Record<string, number> = {};
        workouts.forEach((w) => {
          if (!w.sport_type) return;
          sportMap[w.sport_type] = (sportMap[w.sport_type] || 0) + 1;
        });

        setSportDistribution(
          Object.entries(sportMap).map(([name, value], index) => ({
            name,
            value,
            color: colors[index % colors.length],
          }))
        );

        // Recent activity (3 latest)
        const iconBySport: Record<string, RecentItem["icon"]> = {
          Running: Activity,
          Gym: Zap,
          Strength: Zap,
          Yoga: Award,
        };

        const recent = workouts.slice(0, 3).map((w) => {
          const Icon = iconBySport[w.sport_type] || Activity;
          return {
            id: w.id,
            type: w.sport_type || "Workout",
            duration: w.duration ? `${w.duration} min` : "-",
            distance:
              w.distance != null ? `${w.distance.toFixed(1)} km` : "—",
            time: formatRelative(w.date),
            icon: Icon,
            color: "from-blue-400 to-blue-600",
          } as RecentItem;
        });

        setRecentActivity(recent);
      } catch (err: any) {
        console.error("Error loading dashboard data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-5xl font-bold text-foreground mb-3">
              Welcome Back!
            </h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <p className="text-lg text-muted-foreground font-medium">
                {totalWorkouts > 0
                  ? "You're crushing it! Keep logging your sessions."
                  : "Start by logging your first workout today."}
              </p>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-500">
                Failed to load stats: {error}
              </p>
            )}
          </div>
          <a href="/log-workout">
            <Button
              className="gap-2 whitespace-nowrap bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
              size="lg"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Log Workout</span>
            </Button>
          </a>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Workouts"
            value={loading ? "…" : `${totalWorkouts}`}
            icon={<Activity className="w-6 h-6" />}
            gradient="bg-gradient-to-br from-blue-400 to-blue-600"
            trend={totalWorkouts ? "+ nice consistency" : "Log your first one!"}
          />

          <StatCard
            label="Current Streak"
            value={
              loading
                ? "…"
                : `${currentStreak} ${
                    currentStreak === 1 ? "day" : "days"
                  }`
            }
            icon={<Trophy className="w-6 h-6" />}
            gradient="bg-gradient-to-br from-yellow-400 to-orange-600"
            trend={
              loading
                ? undefined
                : currentStreak > 1
                ? "Great run of workouts – keep it alive!"
                : currentStreak === 1
                ? "Nice – you've started a streak."
                : "Log workouts on consecutive days to build a streak."
            }
          />

          <StatCard
            label="Total Distance"
            value={loading ? "…" : `${totalDistance.toFixed(1)} km`}
            icon={<Target className="w-6 h-6" />}
            gradient="bg-gradient-to-br from-green-400 to-emerald-600"
            trend="based on logged runs"
          />
          <StatCard
            label="Calories Burned"
            value={loading ? "…" : `${caloriesBurned.toFixed(0)}`}
            icon={<Flame className="w-6 h-6" />}
            gradient="bg-gradient-to-br from-red-400 to-pink-600"
            trend="total across all workouts"
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Performance */}
          <div className="lg:col-span-2 bg-card rounded-xl p-6 premium-shadow border border-border/50 animate-slideInUp">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Weekly Performance
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Distance tracked daily (last 7 days)
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
                <XAxis
                  dataKey="day"
                  stroke="var(--color-muted-foreground)"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="distance"
                  fill="url(#colorGradient)"
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--color-primary)"
                      stopOpacity={1}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0.3}
                    />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Breakdown */}
          <div className="bg-card rounded-xl p-6 premium-shadow border border-border/50 animate-slideInUp">
            <h2 className="text-lg font-bold text-foreground mb-4">
              Activity Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sportDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {sportDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {sportDistribution.map((sport) => (
                <div
                  key={sport.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: sport.color }}
                    ></div>
                    <span className="text-muted-foreground">{sport.name}</span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {sport.value}
                  </span>
                </div>
              ))}
              {sportDistribution.length === 0 && !loading && (
                <p className="text-xs text-muted-foreground">
                  No workouts yet – log one to see the breakdown.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl p-6 premium-shadow border border-border/50 animate-slideInUp">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Recent Activity
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your latest workouts
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg bg-transparent"
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/30 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${activity.color} shadow-lg`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground">
                        {activity.type}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.duration} • {activity.distance}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-nowrap ml-4 font-medium">
                    {activity.time}
                  </p>
                </div>
              );
            })}
            {recentActivity.length === 0 && !loading && (
              <p className="text-sm text-muted-foreground">
                No workouts logged yet. Start by adding one from the “Log
                Workout” page.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------- ROUTE EXPORT: wrap with AuthGuard --------
export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
