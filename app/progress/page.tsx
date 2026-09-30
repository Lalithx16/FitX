"use client";

import { useMemo, useState, ChangeEvent, KeyboardEvent } from "react";
import { useAppState } from "@/context/AppStateContext";
import { dayMeta } from "@/lib/program-data";
import { formatShortDate } from "@/lib/day-engine";
import SectionHead from "@/components/SectionHead";
import Accordion from "@/components/Accordion";
import ProgressChart from "@/components/ProgressChart";

type Metric = "weight" | "waist";

export default function ProgressPage() {
  const { state, addMetricEntry } = useAppState();
  const [metric, setMetric] = useState<Metric>("weight");
  const [inputValue, setInputValue] = useState("");

  const data = state[metric];
  const unit = metric === "weight" ? "kg" : "cm";

  function handleAdd() {
    const val = parseFloat(inputValue);
    if (!val || val <= 0) return;
    addMetricEntry(metric, val);
    setInputValue("");
  }

  const historyReversed = useMemo(() => [...data].reverse(), [data]);

  // Full session history (every completed workout, newest first) — see
  // lib/types.ts for why this reads `state.history` and not
  // `state.completions` (the latter only ever holds 4 rows).
  // Capped at the 60 most recent sessions (~a few months of a 4x/week
  // program) purely to keep this list from growing into an ever-larger DOM
  // render after years of continuous use — `state.history` itself (used for
  // the streak/total-sessions stats on Home) is never truncated.
  const SESSION_LOG_LIMIT = 60;
  const sessionEntries = useMemo(() => {
    return [...state.history]
      .map((h, i) => ({ ...h, name: dayMeta(h.dayId)?.name || h.dayId, key: `${h.dayId}_${h.date}_${i}` }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, SESSION_LOG_LIMIT);
  }, [state.history]);

  return (
    <section className="view">
      <div className="topbar">
        <div className="brand">PROGRESS</div>
        <div className="daychip">Track It</div>
      </div>
      <div className="hero-title" style={{ fontSize: 32 }}>
        Better Than
        <br />
        The Scale
      </div>
      <div className="hero-sub">
        Every 2 weeks: waist, morning weight average, photos, strength log.
      </div>

      <div className="pill-row">
        <button
          className={`pill ${metric === "weight" ? "active" : ""}`}
          onClick={() => setMetric("weight")}
        >
          Weight (kg)
        </button>
        <button
          className={`pill ${metric === "waist" ? "active" : ""}`}
          onClick={() => setMetric("waist")}
        >
          Waist (cm)
        </button>
      </div>

      <ProgressChart data={data} />

      <div className="input-row">
        <input
          type="number"
          inputMode="decimal"
          placeholder="Enter value"
          value={inputValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleAdd()}
        />
        <button className="add-btn" onClick={handleAdd} aria-label="Add entry">
          ＋
        </button>
      </div>

      <SectionHead title="History" />
      <div className="card">
        {historyReversed.length === 0 ? (
          <div className="empty-note">No entries yet. Add your first measurement above.</div>
        ) : (
          historyReversed.map((e, i) => (
            <div className="log-item" key={i}>
              <div className="log-date">{formatShortDate(e.date)}</div>
              <div className="log-val">
                {e.value} {unit}
              </div>
            </div>
          ))
        )}
      </div>

      <SectionHead title="Session Log" />
      <div className="card">
        {sessionEntries.length === 0 ? (
          <div className="empty-note">Completed workouts will appear here.</div>
        ) : (
          sessionEntries.map((e) => (
            <div className="log-item" key={e.key}>
              <div className="log-date">{formatShortDate(e.date)}</div>
              <div className="log-val">{e.name}</div>
            </div>
          ))
        )}
      </div>

      <SectionHead title="12-Week Roadmap" />
      <Accordion title="Weeks 1–2 · Learn">
        Learn the machines/form. Light loads, ~3 RIR. If any exercise feels like too much, do 2
        sets instead of 3.
      </Accordion>
      <Accordion title="Weeks 3–6 · Progress">
        Follow double progression. Expect strength to climb quickly.
      </Accordion>
      <Accordion title="Weeks 7–10 · Push">
        Keep progressing. Last set of arm/shoulder exercises can be taken to ~1 RIR.
      </Accordion>
      <Accordion title="Weeks 11–12 · Review">
        Review photos, waist, weight, strength log. If tired and lifts dropped 2+ sessions, take
        one easier week (cut sets ~40%, stop 4 reps short) and continue. After week 12, the cycle
        repeats — Week 13 becomes a fresh &quot;Push&quot;-phase week, with a review/deload check
        every 12 weeks.
      </Accordion>
    </section>
  );
}
