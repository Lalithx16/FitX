"use client";

import { ChangeEvent } from "react";
import { useAppState } from "@/context/AppStateContext";
import { THEMES } from "@/lib/program-data";

export default function SettingsSheet() {
  const { state, settingsOpen, closeSettings, setTheme, setStartDate } = useAppState();

  return (
    <>
      <div
        className={`sheet-overlay ${settingsOpen ? "open" : ""}`}
        onClick={closeSettings}
        aria-hidden={!settingsOpen}
      />
      <div
        className={`sheet ${settingsOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        aria-hidden={!settingsOpen}
      >
        <div className="sheet-handle" />
        <div className="sheet-title">Settings</div>
        <div className="sheet-sub">Personalize your app and set your program start date.</div>

        <div className="settings-lbl">Theme Color</div>
        <div className="theme-grid">
          {THEMES.map((t) => (
            <button
              key={t.id}
              className={`theme-swatch ${state.theme === t.id ? "selected" : ""}`}
              style={{ background: t.accent }}
              onClick={() => setTheme(t.id)}
              aria-label={`${t.name} theme`}
              aria-pressed={state.theme === t.id}
            >
              <span className="check" aria-hidden="true">
                ✓
              </span>
            </button>
          ))}
        </div>

        <div className="settings-row">
          <div className="settings-lbl">Program Start Date (Day 1)</div>
          <input
            type="date"
            value={state.startDate ?? ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.value) setStartDate(e.target.value);
            }}
          />
        </div>

        <button className="sheet-close-btn" onClick={closeSettings}>
          Done
        </button>
      </div>
    </>
  );
}
