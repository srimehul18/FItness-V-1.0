"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Card from "./ui/card";

type WorkoutRow = {
  id: number;
  sport_type: string | null;
  date: string | null;
  duration: number | null;
  distance: number | null;
  calories: number | null;
  notes: string | null;
};

export default function RecentWorkoutsCard() {
  const [workouts, setWorkouts] = useState<WorkoutRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .order("date", { ascending: false })
        .limit(5);

      if (error) {
        console.error(error);
        setError(error.message);
      } else {
        setWorkouts(data || []);
      }
      setLoading(false);
    }

    load();
  }, []);

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-lg">Recent Workouts (Live)</h2>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">Loading workouts…</p>
      )}

      {error && (
        <p className="text-sm text-red-500">Error: {error}</p>
      )}

      {!loading && !error && workouts.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No workouts logged yet. Try saving one from the Log page.
        </p>
      )}

      <ul className="space-y-3">
        {workouts.map((w) => (
          <li
            key={w.id}
            className="flex items-center justify-between rounded-xl bg-white/80 px-4 py-3 shadow-sm"
          >
            <div>
              <div className="font-medium">
                {w.sport_type ?? "Workout"} •{" "}
                {w.date ? new Date(w.date).toLocaleDateString() : "No date"}
              </div>
              {w.notes && (
                <div className="text-xs text-muted-foreground truncate max-w-xs">
                  {w.notes}
                </div>
              )}
            </div>
            <div className="text-right text-xs text-muted-foreground">
              {w.duration != null && <div>{w.duration} min</div>}
              {w.distance != null && <div>{w.distance} km</div>}
              {w.calories != null && <div>{w.calories} kcal</div>}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
