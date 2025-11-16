"use client"

import type React from "react"

import { Activity, Flame, Target, Trophy, Plus, TrendingUp, Zap, Award } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Button } from "../../components/ui/button"

const weeklyData = [
  { day: "Mon", distance: 5.2, calories: 520 },
  { day: "Tue", distance: 6.1, calories: 610 },
  { day: "Wed", distance: 4.8, calories: 480 },
  { day: "Thu", distance: 7.3, calories: 730 },
  { day: "Fri", distance: 8.1, calories: 810 },
  { day: "Sat", distance: 10.2, calories: 1020 },
  { day: "Sun", distance: 6.5, calories: 650 },
]

const sportDistribution = [
  { name: "Running", value: 35, color: "#3b82f6" },
  { name: "Gym", value: 30, color: "#10b981" },
  { name: "Cycling", value: 20, color: "#f59e0b" },
  { name: "Yoga", value: 15, color: "#8b5cf6" },
]

const recentActivity = [
  {
    id: 1,
    type: "Running",
    duration: "45 min",
    distance: "8.1 km",
    time: "2 hours ago",
    icon: Activity,
    color: "from-blue-400 to-blue-600",
  },
  {
    id: 2,
    type: "Strength Training",
    duration: "60 min",
    distance: "4 sets",
    time: "1 day ago",
    icon: Zap,
    color: "from-yellow-400 to-orange-600",
  },
  {
    id: 3,
    type: "Yoga",
    duration: "30 min",
    distance: "Flow",
    time: "2 days ago",
    icon: Award,
    color: "from-purple-400 to-pink-600",
  },
]

interface StatCardProps {
  label: string
  value: string
  icon: React.ReactNode
  gradient: string
  trend?: string
}

function StatCard({ label, value, icon, gradient, trend }: StatCardProps) {
  return (
    <div className="bg-card rounded-xl p-6 premium-shadow border border-border/50 animate-slideInUp hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm mb-2 font-medium">{label}</p>
          <p className="text-3xl font-bold text-foreground text-balance">{value}</p>
          {trend && (
            <p className="text-xs text-secondary mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {trend}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${gradient} shadow-lg`}>
          <div className="text-white">{icon}</div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-5xl font-bold text-foreground mb-3">Welcome Back!</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <p className="text-lg text-muted-foreground font-medium">You're crushing it! 7-day streak</p>
            </div>
          </div>
          <Button
            className="gap-2 whitespace-nowrap bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
            size="lg"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Log Workout</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Workouts"
            value="42"
            icon={<Activity className="w-6 h-6" />}
            gradient="bg-gradient-to-br from-blue-400 to-blue-600"
            trend="+3 this week"
          />
          <StatCard
            label="Current Streak"
            value="7 days"
            icon={<Trophy className="w-6 h-6" />}
            gradient="bg-gradient-to-br from-yellow-400 to-orange-600"
            trend="Keep it up!"
          />
          <StatCard
            label="This Week"
            value="48.3 km"
            icon={<Target className="w-6 h-6" />}
            gradient="bg-gradient-to-br from-green-400 to-emerald-600"
            trend="+12% vs last"
          />
          <StatCard
            label="Calories Burned"
            value="4,320"
            icon={<Flame className="w-6 h-6" />}
            gradient="bg-gradient-to-br from-red-400 to-pink-600"
            trend="+8% progress"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Distance Chart */}
          <div className="lg:col-span-2 bg-card rounded-xl p-6 premium-shadow border border-border/50 animate-slideInUp">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">Weekly Performance</h2>
                <p className="text-sm text-muted-foreground mt-1">Distance tracked daily</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30">
                <TrendingUp className="w-4 h-4 text-secondary" />
                <span className="text-sm font-semibold text-secondary">+12%</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
                <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="distance" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={1} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Sport Distribution */}
          <div className="bg-card rounded-xl p-6 premium-shadow border border-border/50 animate-slideInUp">
            <h2 className="text-lg font-bold text-foreground mb-4">Activity Breakdown</h2>
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
                <div key={sport.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sport.color }}></div>
                    <span className="text-muted-foreground">{sport.name}</span>
                  </div>
                  <span className="font-semibold text-foreground">{sport.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 premium-shadow border border-border/50 animate-slideInUp">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
              <p className="text-sm text-muted-foreground mt-1">Your latest workouts</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity) => {
              const IconComponent = activity.icon
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
                      <p className="font-semibold text-foreground">{activity.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.duration} â€¢ {activity.distance}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-nowrap ml-4 font-medium">{activity.time}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

