"use client"

import type React from "react"

import { useState } from "react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { TrendingUp, Award, Target, Flame } from "lucide-react"
import { Button } from "../../components/ui/button"

const monthlyData = [
  { month: "Jan", distance: 85, calories: 8500, workouts: 12 },
  { month: "Feb", distance: 92, calories: 9200, workouts: 13 },
  { month: "Mar", distance: 110, calories: 11000, workouts: 15 },
  { month: "Apr", distance: 128, calories: 12800, workouts: 17 },
  { month: "May", distance: 145, calories: 14500, workouts: 18 },
  { month: "Jun", distance: 162, calories: 16200, workouts: 20 },
]

interface StatCardProps {
  label: string
  value: string
  change: string
  icon: React.ReactNode
  gradient: string
}

function StatCard({ label, value, change, icon, gradient }: StatCardProps) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-xl p-6 premium-shadow border border-white/10 text-white animate-slideInUp`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/20 backdrop-blur-sm">{icon}</div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">{change}</span>
      </div>
      <p className="text-white/80 text-sm mb-1 font-medium">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}

export default function Progress() {
  const [timeRange, setTimeRange] = useState<"3m" | "6m" | "1y">("6m")

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-5xl font-bold text-foreground mb-3">Your Progress</h1>
            <p className="text-lg text-muted-foreground flex items-center gap-2">
              <Flame className="w-5 h-5 text-secondary" />
              Track your improvement and celebrate milestones
            </p>
          </div>
          <div className="flex gap-2 p-1 bg-muted rounded-lg border border-border/50">
            {(["3m", "6m", "1y"] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={`rounded-md ${timeRange === range ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg" : "text-muted-foreground"}`}
              >
                {range === "3m" ? "3M" : range === "6m" ? "6M" : "1Y"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Distance"
            value="162 km"
            change="+90.6%"
            icon={<Target className="w-6 h-6" />}
            gradient="from-blue-400 to-blue-600"
          />
          <StatCard
            label="Calories Burned"
            value="16.2k"
            change="+90.6%"
            icon={<Flame className="w-6 h-6" />}
            gradient="from-orange-400 to-red-600"
          />
          <StatCard
            label="Total Workouts"
            value="120"
            change="+66.7%"
            icon={<Award className="w-6 h-6" />}
            gradient="from-purple-400 to-purple-600"
          />
          <StatCard
            label="Avg. Per Week"
            value="5.2 km"
            change="+12.5%"
            icon={<TrendingUp className="w-6 h-6" />}
            gradient="from-green-400 to-emerald-600"
          />
        </div>

        <div className="bg-card rounded-xl border border-border/50 p-6 premium-shadow animate-slideInUp">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Total Distance (km)</h2>
              <p className="text-sm text-muted-foreground mt-2">Steady progress towards your goals</p>
            </div>
            <div className="text-right bg-gradient-to-r from-blue-500/10 to-blue-600/10 px-4 py-3 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
              <p className="text-2xl font-bold text-primary">162 km</p>
              <p className="text-sm text-secondary">+90.6% growth</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDistance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
              <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
                formatter={(value) => `${value} km`}
              />
              <Area
                type="monotone"
                dataKey="distance"
                stroke="var(--color-primary)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorDistance)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calories Progress */}
          <div className="bg-card rounded-xl border border-border/50 p-6 premium-shadow animate-slideInUp">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">Calories Burned</h2>
                <p className="text-sm text-muted-foreground mt-1">Monthly trend</p>
              </div>
              <div className="text-right bg-gradient-to-r from-orange-500/10 to-red-600/10 px-4 py-3 rounded-lg border border-orange-200/50 dark:border-orange-800/50">
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">16.2k</p>
                <p className="text-xs text-muted-foreground">This period</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
                <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => `${value} kcal`}
                />
                <Line
                  type="monotone"
                  dataKey="calories"
                  stroke="var(--color-secondary)"
                  strokeWidth={3}
                  dot={{ fill: "var(--color-secondary)", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Workouts Per Month */}
          <div className="bg-card rounded-xl border border-border/50 p-6 premium-shadow animate-slideInUp">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">Workouts Per Month</h2>
                <p className="text-sm text-muted-foreground mt-1">Consistency tracking</p>
              </div>
              <div className="text-right bg-gradient-to-r from-purple-500/10 to-purple-600/10 px-4 py-3 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">120</p>
                <p className="text-xs text-muted-foreground">Total workouts</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
                <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => `${value} workouts`}
                />
                <Bar dataKey="workouts" fill="var(--color-accent)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border/50 p-6 premium-shadow animate-slideInUp">
          <h2 className="text-2xl font-bold text-foreground mb-6">Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-6 border border-blue-200/50 dark:border-blue-800/50 hover:border-blue-400/50 transition-colors">
              <p className="text-sm font-semibold text-foreground mb-2">Best Month</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">June</p>
              <p className="text-xs text-muted-foreground mt-3">162 km with 20 workouts</p>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-xl p-6 border border-green-200/50 dark:border-green-800/50 hover:border-green-400/50 transition-colors">
              <p className="text-sm font-semibold text-foreground mb-2">Average per Workout</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">7.4 km</p>
              <p className="text-xs text-muted-foreground mt-3">Consistent improvement</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-6 border border-purple-200/50 dark:border-purple-800/50 hover:border-purple-400/50 transition-colors">
              <p className="text-sm font-semibold text-foreground mb-2">Personal Best</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">20</p>
              <p className="text-xs text-muted-foreground mt-3">Workouts in a month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

