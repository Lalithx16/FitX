"use client";

import { useRouter } from "next/navigation";
import { WorkoutDay } from "@/lib/types";
import ExerciseThumb from "./ExerciseThumb";

export default function DayCard({ day }: { day: WorkoutDay }) {
  const router = useRouter();
  return (
    <button
      className="day-card"
      onClick={() => router.push(`/workouts/${day.id}`)}
      aria-label={`Open ${day.name} workout`}
    >
      <ExerciseThumb imgKey={day.exercises[0].img} alt="" size="small" />
      <div className="day-info">
        <div className="day-name">{day.name}</div>
        <div className="day-focus">
          {day.focus} · {day.exercises.length} exercises
        </div>
      </div>
      <div className="day-chevron" aria-hidden="true">
        ›
      </div>
    </button>
  );
}
