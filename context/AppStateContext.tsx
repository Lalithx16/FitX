"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { AppState, MetricEntry } from "@/lib/types";
import { loadState, saveState, defaultState } from "@/lib/storage";
import { todayKey } from "@/lib/day-engine";
import { THEMES } from "@/lib/program-data";

interface AppStateContextValue {
  state: AppState;
  /** true once localStorage has been read on the client — gates first render
   *  so we never flash server-default content that mismatches saved data. */
  hydrated: boolean;

  toggleExerciseDone: (setKey: string) => void;
  saveSetValue: (setKey: string, setIndex: number, value: string) => void;
  toggleDayComplete: (dayId: string, dateKey: string) => void;
  isDayCompleteOn: (dayId: string, dateKey: string) => boolean;

  addMetricEntry: (metric: "weight" | "waist", value: number) => void;
  setBodyWeight: (kg: number) => void;

  setTheme: (themeId: string) => void;
  setStartDate: (dateKey: string) => void;

  resetAllData: () => void;

  // Settings bottom-sheet visibility — pure UI state, intentionally kept
  // separate from the persisted AppState shape above.
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  // Starts as the framework-agnostic default (identical on server and the
  // client's first paint) so there's nothing to mismatch during hydration.
  // `loadState()` itself is only ever called after mount, from the effect
  // below — never during the initial render — since it touches
  // `window.localStorage`, which does not exist during SSR, and calling it
  // eagerly here would mean reading + JSON.parse-ing localStorage twice on
  // every page load for no benefit (the effect immediately re-reads it).
  const [state, setState] = useState<AppState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Read the real persisted state once we're safely on the client, then
  // flip `hydrated` so <Gate> (see AppShell.tsx) can stop showing the
  // loading skeleton and reveal the real screens.
  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  // Persist on every change.
  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  // Apply the current theme's CSS custom properties to <html> whenever it
  // changes, exactly like the original applyTheme() did on document.documentElement.
  useEffect(() => {
    const t = THEMES.find((x) => x.id === state.theme) || THEMES[0];
    const root = document.documentElement;
    root.style.setProperty("--accent", t.accent);
    root.style.setProperty("--accent-rgb", t.rgb);
    root.style.setProperty("--accent-ink", t.ink);
  }, [state.theme]);

  const toggleExerciseDone = useCallback((setKey: string) => {
    setState((prev) => {
      const existing = prev.sets[setKey] ?? { done: false, vals: [] };
      return {
        ...prev,
        sets: {
          ...prev.sets,
          [setKey]: { ...existing, done: !existing.done },
        },
      };
    });
  }, []);

  const saveSetValue = useCallback((setKey: string, setIndex: number, value: string) => {
    setState((prev) => {
      const existing = prev.sets[setKey] ?? { done: false, vals: [] };
      const vals = [...existing.vals];
      vals[setIndex] = value;
      return {
        ...prev,
        sets: { ...prev.sets, [setKey]: { ...existing, vals } },
      };
    });
  }, []);

  const isDayCompleteOn = useCallback(
    (dayId: string, dateKey: string) => state.completions[dayId] === dateKey,
    [state.completions]
  );

  const toggleDayComplete = useCallback((dayId: string, dateKey: string) => {
    setState((prev) => {
      const nextCompletions = { ...prev.completions };
      const wasCompleteOnThisDate = nextCompletions[dayId] === dateKey;

      if (wasCompleteOnThisDate) {
        // Undo: clear the per-date flag and remove exactly the one history
        // record this same toggle created, so re-toggling is a clean,
        // symmetric no-op rather than leaving a phantom session behind.
        delete nextCompletions[dayId];
        const idx = prev.history.findIndex((h) => h.dayId === dayId && h.date === dateKey);
        const nextHistory =
          idx === -1 ? prev.history : [...prev.history.slice(0, idx), ...prev.history.slice(idx + 1)];
        return { ...prev, completions: nextCompletions, history: nextHistory };
      }

      nextCompletions[dayId] = dateKey;
      // Guard against duplicate history rows if this exact session was
      // somehow already logged (shouldn't happen via the UI, but keeps the
      // log correct if it ever does).
      const alreadyLogged = prev.history.some((h) => h.dayId === dayId && h.date === dateKey);
      const nextHistory = alreadyLogged ? prev.history : [...prev.history, { dayId, date: dateKey }];
      return { ...prev, completions: nextCompletions, history: nextHistory };
    });
  }, []);

  const addMetricEntry = useCallback((metric: "weight" | "waist", value: number) => {
    setState((prev) => {
      const today = todayKey();
      // Upsert rather than always pushing: if the user already logged this
      // metric today (e.g. correcting a typo, or a double-tap on the ＋
      // button) we replace today's value in place instead of accumulating
      // duplicate rows for the same date in the history/chart.
      const existingIdx = prev[metric].findIndex((e) => e.date === today);
      const arr: MetricEntry[] =
        existingIdx === -1
          ? [...prev[metric], { date: today, value }]
          : prev[metric].map((e, i) => (i === existingIdx ? { ...e, value } : e));
      arr.sort((a, b) => a.date.localeCompare(b.date));
      return { ...prev, [metric]: arr };
    });
  }, []);

  const setBodyWeight = useCallback((kg: number) => {
    setState((prev) => ({ ...prev, bw: kg }));
  }, []);

  const setTheme = useCallback((themeId: string) => {
    setState((prev) => ({ ...prev, theme: themeId }));
  }, []);

  const setStartDate = useCallback((dateKey: string) => {
    setState((prev) => ({ ...prev, startDate: dateKey }));
  }, []);

  const resetAllData = useCallback(() => {
    setState((prev) => ({
      completions: {},
      history: [],
      sets: {},
      weight: [],
      waist: [],
      bw: null,
      theme: prev.theme,
      startDate: todayKey(),
    }));
  }, []);

  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const value = useMemo<AppStateContextValue>(
    () => ({
      state,
      hydrated,
      toggleExerciseDone,
      saveSetValue,
      toggleDayComplete,
      isDayCompleteOn,
      addMetricEntry,
      setBodyWeight,
      setTheme,
      setStartDate,
      resetAllData,
      settingsOpen,
      openSettings,
      closeSettings,
    }),
    [
      state,
      hydrated,
      toggleExerciseDone,
      saveSetValue,
      toggleDayComplete,
      isDayCompleteOn,
      addMetricEntry,
      setBodyWeight,
      setTheme,
      setStartDate,
      resetAllData,
      settingsOpen,
      openSettings,
      closeSettings,
    ]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return ctx;
}
