"use client";

import React, { useState } from "react";
import Card from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { supabase } from "../../lib/supabaseClient";

export default function LogWorkout() {
  const [sportType, setSportType] = useState("Running");
  const [date, setDate] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [distance, setDistance] = useState<string>("");
  const [calories, setCalories] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [status, setStatus] =
    useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSave() {
    setStatus("saving");
    setErrorMsg(null);

    // 🔹 Get current logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setStatus("error");
      setErrorMsg("You must be logged in to save workouts.");
      return;
    }

    const payload = {
      user_id: user.id, // 🔥 key line
      sport_type: sportType,
      date: date || new Date().toISOString().slice(0, 10), // YYYY-MM-DD
      duration: duration ? Number(duration) : null,
      distance: distance ? Number(distance) : null,
      calories: calories ? Number(calories) : null,
      notes: notes || null,
    };

    console.log("INSERT PAYLOAD", payload);

    const { error } = await supabase.from("workouts").insert(payload);

    if (error) {
      console.log("INSERT ERROR", error);
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }

    setStatus("success");

    // clear form (keep sport + date)
    setDuration("");
    setDistance("");
    setCalories("");
    setNotes("");
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Log Your Workout</h1>

      <Card className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Sport Type</div>
            <Select
              value={sportType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSportType(e.target.value)
              }
            >
              <option>Running</option>
              <option>Gym</option>
              <option>Cycling</option>
              <option>Yoga</option>
              <option>Swimming</option>
              <option>Hiking</option>
              <option>Other</option>
            </Select>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Date</div>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <Card className="mb-4">
        <div className="text-sm font-medium mb-3">Performance Metrics</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <Input
            placeholder="Distance (km)"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
          <Input
            placeholder="Calories"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />
        </div>
      </Card>

      <Card className="mb-4">
        <div className="text-sm font-medium mb-3">Additional Information</div>
        <Textarea
          placeholder="Notes & feelings"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Card>

      {status === "error" && (
        <p className="mt-2 text-sm text-red-500">
          ⚠ Failed to save workout: {errorMsg}
        </p>
      )}
      {status === "success" && (
        <p className="mt-2 text-sm text-green-600">
          ✅ Workout saved successfully!
        </p>
      )}

      <div className="mt-6">
        <Button
          className="btn-pill w-full"
          onClick={handleSave}
          disabled={status === "saving"}
        >
          💾 {status === "saving" ? "Saving..." : "Save Workout"}
        </Button>
      </div>
    </main>
  );
}
