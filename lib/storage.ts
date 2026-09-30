import { AppState } from "./types";
import { todayKey } from "./day-engine";

/**
 * localStorage persistence.
 *
 * Why localStorage and not Supabase: this is a single-user, on-device
 * training log. Nothing here needs to be shared between people or synced
 * across devices for the app to be useful, so a backend/database would add
 * hosting cost, auth complexity and network failure modes for zero
 * functional benefit. See the project README for the full rationale and
 * the notes on how to add Supabase later if cross-device sync is ever
 * wanted.
 */

export const STORE_KEY = "leanfit_v2";

export function defaultState(): AppState {
  return {
    completions: {},
    history: [],
    sets: {},
    weight: [],
    waist: [],
    bw: null,
    theme: "volt",
    startDate: null,
  };
}

/** Safe to call on the server too — returns defaults when window is undefined. */
export function loadState(): AppState {
  if (typeof window === "undefined") {
    return defaultState();
  }
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      return { ...defaultState(), ...parsed };
    }
  } catch {
    // Corrupt or inaccessible storage (e.g. private browsing quota) —
    // fall back to a clean in-memory default rather than crashing the app.
  }
  const state = defaultState();
  state.startDate = todayKey();
  return state;
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — silently ignore; the in-memory state
    // for this session is still correct, only persistence across reloads
    // is affected. Surfacing a toast for this is a reasonable future
    // enhancement but not required for core functionality.
  }
}
