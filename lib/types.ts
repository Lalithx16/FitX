/**
 * Core domain types for the LEAN&FIT training app.
 * Kept framework-agnostic so this file can be unit-tested in isolation.
 */

export interface Exercise {
  name: string;
  scheme: string; // e.g. "3 × 6–10"
  rest: string; // e.g. "2–3 min"
  cue: string;
  /** key into the exercise thumbnail map, see lib/exercise-images.ts */
  img: string;
}

export interface WorkoutDay {
  id: string; // "day1" .. "day4"
  num: string; // display number "1".."4"
  name: string;
  focus: string;
  exercises: Exercise[];
  optional?: string;
}

export type CycleItemType = "day" | "rest" | "cardio";

export interface CycleItem {
  type: CycleItemType;
  dayId?: string; // present when type === "day"
  label?: string;
  title?: string;
  sub?: string;
  img: string;
}

export interface Theme {
  id: string;
  name: string;
  accent: string;
  rgb: string;
  ink: string;
}

export interface Phase {
  name: "Learn" | "Progress" | "Push" | "Review";
  note: string;
}

/** Per-set logged values for a single exercise on a given workout day. */
export interface ExerciseSetLog {
  done: boolean;
  vals: string[];
}

export interface MetricEntry {
  date: string; // yyyy-mm-dd
  value: number;
}

/** One completed workout session, kept forever (see `history` below). */
export interface SessionRecord {
  dayId: string;
  date: string; // yyyy-mm-dd
}

/**
 * Full persisted application state — everything in here is written to
 * localStorage as a single JSON blob (see lib/storage.ts).
 *
 * NOTE on `completions` vs `history`:
 * - `completions` answers "was THIS workout type completed on THIS exact
 *   calendar date?" — it stores only the most recent completion date per
 *   workout-day id (day1..day4) and exists purely to drive the per-date
 *   "Completed ✓" / "Mark Day Complete" UI state when viewing a specific day.
 * - `history` is the full, append-only log of every completed session ever
 *   (found via a pre-deployment audit: an earlier revision derived "Total
 *   Sessions", "Day Streak" and the Progress-tab "Session Log" directly from
 *   `completions`, which can only ever hold 4 entries — one per workout
 *   type — so those stats silently stopped growing after a user's 4th
 *   session, and the Session Log could never show more than 4 rows. `history`
 *   fixes that data-loss bug; `completions` is kept only for the per-date
 *   lookup it was designed for).
 */
export interface AppState {
  completions: Record<string, string>; // dayId -> yyyy-mm-dd (latest only)
  history: SessionRecord[]; // every completed session ever, chronological
  sets: Record<string, ExerciseSetLog>; // `${dayId}_${exerciseIndex}` -> log
  weight: MetricEntry[];
  waist: MetricEntry[];
  bw: number | null; // last entered body weight, used for protein calc
  theme: string;
  startDate: string | null; // yyyy-mm-dd, anchors "Program Day 1"
}
