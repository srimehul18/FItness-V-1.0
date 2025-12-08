// app/profile/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import AuthGuard from "../../components/auth-guard";
import ProfileBanner from "../../components/profile-banner";
import Card from "../../components/ui/card";
import BadgeCard from "../../components/ui/badge";
import { supabase } from "../../lib/supabaseClient";

type WorkoutRow = {
  duration: number | null;
  sport_type: string | null;
  distance: number | null;
  date: string; // ISO date
};

function normaliseDate(d: string): string {
  // returns YYYY-MM-DD
  const date = new Date(d);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function ProfileContent() {
  const [displayName, setDisplayName] = useState<string>("Athlete");
  const [subtitle, setSubtitle] = useState<string>("Pro Edition");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  const [avgDuration, setAvgDuration] = useState<number>(0);
  const [favoriteSport, setFavoriteSport] = useState<string>("-");
  const [totalWorkouts, setTotalWorkouts] = useState<number>(0);

  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [personalBestDistance, setPersonalBestDistance] =
    useState<number>(0);
  const [longestStreak, setLongestStreak] = useState<number>(0);
  const [postCount, setPostCount] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      // 1) Current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error loading user in profile page:", userError);
        setLoading(false);
        return;
      }

      if (!user) {
        setLoading(false);
        return;
      }

      // Friendly name + subtitle
      const meta: any = user.user_metadata || {};
      const fullName =
        meta.full_name ||
        meta.name ||
        user.email?.split("@")[0] ||
        "Athlete";

      setDisplayName(fullName);
      setSubtitle(`Pro Edition • ${user.email}`);

      // 🔹 Avatar from Google (or other provider), with DiceBear fallback
      const googlePhoto: string | undefined =
        meta.avatar_url || meta.picture;
      const initialsSource = fullName || user.email || "User";
      const fallbackAvatar = `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(
        initialsSource
      )}`;
      setAvatarUrl(googlePhoto || fallbackAvatar);

      // 2) Load workouts for this user
      const { data: workouts, error: workoutError } = await supabase
        .from("workouts")
        .select("duration, sport_type, distance, date")
        .eq("user_id", user.id);

      if (workoutError) {
        console.error(
          "Error loading workouts for profile stats:",
          workoutError
        );
        setLoading(false);
        return;
      }

      if (!workouts || workouts.length === 0) {
        setAvgDuration(0);
        setFavoriteSport("-");
        setTotalWorkouts(0);
        setTotalDistance(0);
        setPersonalBestDistance(0);
        setLongestStreak(0);
      } else {
        const typed = workouts as WorkoutRow[];
        setTotalWorkouts(typed.length);

        // Average duration + favourite sport
        let totalDuration = 0;
        const sportCounts = new Map<string, number>();

        let distanceSum = 0;
        let bestDistance = 0;

        const dateSet = new Set<string>();

        for (const w of typed) {
          const dur = w.duration ?? 0;
          totalDuration += dur;

          const sport = (w.sport_type ?? "Other").trim() || "Other";
          sportCounts.set(sport, (sportCounts.get(sport) ?? 0) + 1);

          const dist = w.distance ?? 0;
          distanceSum += dist;
          if (dist > bestDistance) bestDistance = dist;

          if (w.date) {
            dateSet.add(normaliseDate(w.date));
          }
        }

        setAvgDuration(totalDuration / typed.length);
        setTotalDistance(distanceSum);
        setPersonalBestDistance(bestDistance);

        // Favourite sport
        let favSport = "-";
        let maxCount = 0;
        for (const [sport, count] of Array.from(sportCounts.entries())) {
          if (count > maxCount) {
            maxCount = count;
            favSport = sport;
          }
        }
        setFavoriteSport(favSport);

        // Longest streak of consecutive days
        const sortedDates = Array.from(dateSet).sort(); // YYYY-MM-DD sorts lexicographically
        let streak = 0;
        let longest = 0;
        let prev: Date | null = null;

        for (const ds of sortedDates) {
          const d = new Date(ds);
          if (!prev) {
            streak = 1;
          } else {
            const diffDays =
              (d.getTime() - prev.getTime()) /
              (1000 * 60 * 60 * 24);
            if (diffDays === 1) {
              streak += 1;
            } else if (diffDays === 0) {
              // same day, ignore
            } else {
              streak = 1;
            }
          }
          if (streak > longest) longest = streak;
          prev = d;
        }
        setLongestStreak(longest);
      }

      // 3) Count posts for Social Butterfly badge
      const { count: postsCount, error: postsError } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (postsError) {
        console.error("Error counting posts:", postsError);
      } else if (typeof postsCount === "number") {
        setPostCount(postsCount);
      }

      setLoading(false);
    }

    load();
  }, []);

  // --- Badge unlock rules (tweak thresholds as you like) ---
  const centuryRunnerUnlocked = totalDistance >= 100; // 100+ km
  const consistencyKingUnlocked = longestStreak >= 7; // 7-day streak
  const peakPerformanceUnlocked = personalBestDistance >= 10; // 10+ km
  const socialButterflyUnlocked = postCount >= 5; // 5+ posts

  return (
    <main className="max-w-6xl mx-auto p-6">
      <ProfileBanner
        name={displayName}
        subtitle={subtitle}
        avatar={avatarUrl}   // 👈 now shows Google / fallback avatar
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Badges section */}
        <div className="lg:col-span-2">
          <Card className="mb-4">
            <div className="text-lg font-semibold mb-4">
              Badges &amp; Achievements
            </div>

            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <BadgeCard
                title="Century Runner"
                subtitle="Run 100+ km"
                color="blue"
                locked={!centuryRunnerUnlocked}
              />
              <BadgeCard
                title="Consistency King"
                subtitle="30-day streak"
                color="yellow"
                locked={!consistencyKingUnlocked}
              />
              <BadgeCard
                title="Peak Performance"
                subtitle="Personal record"
                color="purple"
                locked={!peakPerformanceUnlocked}
              />
              <BadgeCard
                title="Social Butterfly"
                subtitle="50 community posts"
                color="pink"
                locked={!socialButterflyUnlocked}
              />
            </div>
          </Card>
        </div>

        {/* Quick stats – powered by real data */}
        <div>
          <Card className="mb-4">
            <div className="text-sm font-medium mb-4">Quick Stats</div>
            <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm">
              <div className="card-sm p-3 text-center rounded-2xl bg-white shadow-sm">
                <div className="text-[11px] text-muted-foreground">
                  Avg Workout
                </div>
                <div className="font-bold mt-1">
                  {loading ? "—" : `${avgDuration.toFixed(0)} min`}
                </div>
              </div>
              <div className="card-sm p-3 text-center rounded-2xl bg-white shadow-sm">
                <div className="text-[11px] text-muted-foreground">
                  Favorite Sport
                </div>
                <div className="font-bold mt-1">
                  {loading ? "—" : favoriteSport}
                </div>
              </div>
              <div className="card-sm p-3 text-center rounded-2xl bg-white shadow-sm">
                <div className="text-[11px] text-muted-foreground">
                  Total Workouts
                </div>
                <div className="font-bold mt-1">
                  {loading ? "—" : totalWorkouts}
                </div>
              </div>
            </div>
            {loading && (
              <p className="mt-3 text-[11px] text-muted-foreground text-center">
                Loading your stats…
              </p>
            )}
            {!loading && totalWorkouts === 0 && (
              <p className="mt-3 text-[11px] text-muted-foreground text-center">
                Log your first workout to start unlocking badges!
              </p>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}
