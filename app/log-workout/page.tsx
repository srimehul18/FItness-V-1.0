"use client";
import React from "react";
import Card from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";

export default function LogWorkout() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Log Your Workout</h1>

      <Card className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Sport Type</div>
            <Select>
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
            <Input type="date" />
          </div>
        </div>
      </Card>

      <Card className="mb-4">
        <div className="text-sm font-medium mb-3">Performance Metrics</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input placeholder="Duration (minutes)" />
          <Input placeholder="Distance (km)" />
          <Input placeholder="Calories" />
        </div>
      </Card>

      <Card className="mb-4">
        <div className="text-sm font-medium mb-3">Additional Information</div>
        <Textarea placeholder="Notes & feelings" />
        <div className="mt-4">
          <div className="text-xs text-muted-foreground mb-2">Workout Photo</div>
          <div className="border-dashed border-2 border-muted p-8 rounded-md text-center">Drag and drop or click to upload</div>
        </div>
      </Card>

      <div className="mt-6">
        <Button className="btn-pill w-full">💾 Save Workout</Button>
      </div>
    </main>
  );
}
