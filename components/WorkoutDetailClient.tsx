"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { dayMeta } from "@/lib/program-data";
import { todayKey } from "@/lib/day-engine";
import { useAppState } from "@/context/AppStateContext";
import ExerciseCard from "./ExerciseCard";

export default function WorkoutDetailClient({ dayId }: { dayId: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isDayCompleteOn, toggleDayComplete } = useAppState();

  const day = dayMeta(dayId);
  const dateKey = searchParams.get("date") || todayKey();

  if (!day) {
    return (
      <section className="view">
        <button className="backbtn" onClick={() => router.push("/workouts")}>
          <span className="chev">‹</span> Workouts
        </button>
        <div className="hero-title" style={{ fontSize: 28 }}>
          Workout not found
        </div>
        <div className="hero-sub">That workout day doesn&apos;t exist in the current program.</div>
      </section>
    );
  }

  const done = isDayCompleteOn(day.id, dateKey);

  return (
    <section className="view">
      <button className="backbtn" onClick={() => router.push("/workouts")}>
        <span className="chev">‹</span> Workouts
      </button>
      <div className="daychip" style={{ marginBottom: 8, display: "inline-block" }}>
        Day {day.num}
      </div>
      <div className="hero-title" style={{ fontSize: 30 }}>
        {day.name}
      </div>
      <div className="hero-sub">
        {day.focus} · {day.exercises.length} exercises · ~50–65 min
      </div>

      {day.exercises.map((ex, idx) => (
        <ExerciseCard key={idx} exercise={ex} index={idx} dayId={day.id} />
      ))}

      {day.optional && (
        <div className="info-box">
          <span className="tag">Optional</span>
          {day.optional}
        </div>
      )}

      <button
        className={`finish-btn ${done ? "done" : ""}`}
        onClick={() => toggleDayComplete(day.id, dateKey)}
      >
        {done ? "✓ Day Complete — Tap to Undo" : "Mark Day Complete"}
      </button>
    </section>
  );
}
