"use client";

import { ChangeEvent, KeyboardEvent } from "react";
import { Exercise } from "@/lib/types";
import { useAppState } from "@/context/AppStateContext";
import ExerciseThumb from "./ExerciseThumb";

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  dayId: string;
}

/** Parses the leading set count out of a scheme string like "3 × 6–10" -> 3. */
function setCountFromScheme(scheme: string): number {
  const n = parseInt(scheme.split("×")[0].trim(), 10);
  return Number.isFinite(n) && n > 0 ? n : 3;
}

export default function ExerciseCard({ exercise, index, dayId }: ExerciseCardProps) {
  const { state, toggleExerciseDone, saveSetValue } = useAppState();
  const setKey = `${dayId}_${index}`;
  const log = state.sets[setKey];
  const checked = Boolean(log?.done);
  const numSets = setCountFromScheme(exercise.scheme);

  return (
    <div className="ex-card">
      <div className="ex-head">
        <ExerciseThumb imgKey={exercise.img} alt={exercise.name} />
        <div className="ex-namewrap">
          <div className="ex-name">
            {index + 1}. {exercise.name}
          </div>
          <div className="ex-scheme">{exercise.scheme}</div>
          <div className="ex-rest">Rest {exercise.rest}</div>
        </div>
        <button
          className={`ex-check ${checked ? "done" : ""}`}
          onClick={() => toggleExerciseDone(setKey)}
          aria-pressed={checked}
          aria-label={checked ? "Mark exercise not done" : "Mark exercise done"}
        >
          {checked ? "✓" : ""}
        </button>
      </div>
      <div className="ex-cue">{exercise.cue}</div>
      <div className="setlog">
        {Array.from({ length: numSets }).map((_, setIdx) => (
          <div key={setIdx}>
            <input
              type="text"
              inputMode="decimal"
              placeholder="0"
              // Controlled (not defaultValue/onBlur): the field must always
              // reflect `state.sets`, including when it's cleared out from
              // under this component by Reset All Data or any future bulk
              // update. An uncontrolled field with onBlur-only saving can
              // (a) show stale values after such an external reset, and
              // (b) lose the last keystroke if the field never blurs before
              // the component unmounts (e.g. an iOS back-swipe navigation).
              value={log?.vals?.[setIdx] ?? ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                saveSetValue(setKey, setIdx, e.target.value)
              }
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              }}
              aria-label={`${exercise.name} set ${setIdx + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
