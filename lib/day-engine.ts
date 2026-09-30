import { Phase } from "./types";

/**
 * Date / program-day math, ported 1:1 from the original vanilla-JS app.
 * All functions are pure (no I/O, no localStorage) so they're easy to
 * reason about and unit test.
 */

/** Format a Date as a local yyyy-mm-dd key (no timezone shifting). */
export function toKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parse a yyyy-mm-dd key back into a local Date (midnight, local time). */
export function parseKey(k: string): Date {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey(): string {
  return toKey(new Date());
}

/** Program Day 1 == startDateKey. Returns the 1-indexed program day number
 *  for any given calendar date (can be zero or negative if before start). */
export function programDayNumber(dateKey: string, startDateKey: string): number {
  const start = parseKey(startDateKey);
  const cur = parseKey(dateKey);
  const diffDays = Math.round((cur.getTime() - start.getTime()) / 86400000);
  return diffDays + 1;
}

/** Inverse of programDayNumber: given a program day number, return its date key. */
export function dateKeyForProgramDay(dayNum: number, startDateKey: string): string {
  const start = parseKey(startDateKey);
  const d = new Date(start);
  d.setDate(d.getDate() + (dayNum - 1));
  return toKey(d);
}

/** 0-indexed position (0..6) into WEEKLY_CYCLE for a given program day number. */
export function cyclePosition(progDay: number): number {
  return (((progDay - 1) % 7) + 7) % 7;
}

/** 1-indexed training week number for a given program day number. */
export function weekNumber(progDay: number): number {
  return Math.ceil(progDay / 7);
}

/** Maps an absolute week number onto a repeating 1..12 "effective week"
 *  used to determine training phase. The 12-week cycle repeats indefinitely. */
export function effectiveWeek(weekNum: number): number {
  return (((weekNum - 1) % 12) + 12) % 12 + 1;
}

export function phaseForWeek(effWeek: number): Phase {
  if (effWeek <= 2) {
    return {
      name: "Learn",
      note: "You're learning the movements. Use lighter loads and stay around 3 reps in reserve (RIR). If any exercise feels like too much, do 2 sets instead of 3 — focus on clean form over weight.",
    };
  }
  if (effWeek <= 6) {
    return {
      name: "Progress",
      note: "Follow double progression on every exercise: once you hit the top of the rep range on all sets, add a little weight next session. Aim for ~2 RIR on most working sets.",
    };
  }
  if (effWeek <= 10) {
    return {
      name: "Push",
      note: "Keep progressing the loads. On the last set of arm and shoulder isolation exercises, you can push to ~1 RIR. Compounds stay around 2 RIR.",
    };
  }
  return {
    name: "Review",
    note: "Review your photos, waist, weight trend and strength log. If you feel run-down and lifts have dropped for 2+ sessions in a row, take an easier deload week — cut sets by about 40% and stop 3–4 reps short of failure — then continue.",
  };
}

export function formatDisplayDate(iso: string): string {
  const d = parseKey(iso);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(iso: string): string {
  const d = parseKey(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
