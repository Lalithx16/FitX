"use client";

import { useMemo, useState, ChangeEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/context/AppStateContext";
import { dayMeta, WEEKLY_CYCLE } from "@/lib/program-data";
import { EX_IMG } from "@/lib/exercise-images";
import {
  cyclePosition,
  dateKeyForProgramDay,
  effectiveWeek,
  formatDisplayDate,
  parseKey,
  phaseForWeek,
  programDayNumber,
  toKey,
  todayKey,
  weekNumber,
} from "@/lib/day-engine";
import SectionHead from "./SectionHead";

export default function HomeView() {
  const router = useRouter();
  const { state, openSettings } = useAppState();
  const [viewDateKey, setViewDateKey] = useState<string>(() => todayKey());
  const [jumpValue, setJumpValue] = useState("");

  const startDate = state.startDate ?? todayKey();
  const today = todayKey();
  const isToday = viewDateKey === today;

  const progDay = useMemo(() => programDayNumber(viewDateKey, startDate), [viewDateKey, startDate]);
  const wk = useMemo(() => weekNumber(progDay), [progDay]);
  const effWk = useMemo(() => effectiveWeek(wk), [wk]);
  const phase = useMemo(() => phaseForWeek(effWk), [effWk]);
  const sched = WEEKLY_CYCLE[cyclePosition(progDay)];

  const dateLabel = formatDisplayDate(viewDateKey);
  const dateSub =
    (isToday ? "Today" : progDay < 1 ? "Before your program starts" : "") +
    (progDay >= 1 ? `${isToday ? " · " : ""}Program Day ${progDay}` : "");

  function shiftDay(delta: number) {
    const d = parseKey(viewDateKey);
    d.setDate(d.getDate() + delta);
    setViewDateKey(toKey(d));
  }

  function jumpToDayNumber() {
    const n = parseInt(jumpValue, 10);
    if (!n || n < 1) return;
    setViewDateKey(dateKeyForProgramDay(n, startDate));
    setJumpValue("");
  }

  // ---- Stats ----
  // All three stats below are derived from the full `history` log (every
  // session ever completed), not from `completions` (which only ever holds
  // the latest completion per workout-day id, max 4 entries). Deriving
  // stats from `completions` was a real data-loss bug found in audit: once
  // a user had done all 4 workout types at least once, "Total Sessions" and
  // "Day Streak" would silently stop increasing no matter how many more
  // sessions they logged.
  const sessionDates = useMemo(() => new Set(state.history.map((h) => h.date)), [state.history]);

  const streak = useMemo(() => {
    let count = 0;
    const cursor = new Date();
    while (sessionDates.has(toKey(cursor))) {
      count++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }, [sessionDates]);

  const totalSessions = state.history.length;

  const cycleCount = useMemo(() => {
    if (progDay < 1) return null;
    const weekStartDay = (wk - 1) * 7 + 1;
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const dn = weekStartDay + i;
      const key = dateKeyForProgramDay(dn, startDate);
      if (sessionDates.has(key)) count++;
    }
    return count;
  }, [progDay, wk, startDate, sessionDates]);

  return (
    <section className="view">
      <div className="topbar">
        <div className="brand">
          LEAN<b>&amp;</b>FIT
        </div>
        <button className="gear-btn" onClick={openSettings} aria-label="Settings">
          ⚙
        </button>
      </div>

      <div className="date-nav">
        <button className="nav-arrow" onClick={() => shiftDay(-1)} aria-label="Previous day">
          ‹
        </button>
        <div className="date-center">
          <div className="dbig">{dateLabel}</div>
          <div className="dsmall">{dateSub}</div>
          <input
            type="date"
            aria-label="Pick a date"
            value={viewDateKey}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              e.target.value && setViewDateKey(e.target.value)
            }
          />
        </div>
        <button className="nav-arrow" onClick={() => shiftDay(1)} aria-label="Next day">
          ›
        </button>
      </div>

      <div className="dayjump-row">
        <input
          type="number"
          inputMode="numeric"
          placeholder="Jump to Day # e.g. 40"
          value={jumpValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setJumpValue(e.target.value)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && jumpToDayNumber()}
        />
        <button className="dayjump-btn" onClick={jumpToDayNumber}>
          Go
        </button>
        <button className="dayjump-btn" onClick={() => setViewDateKey(todayKey())}>
          Today
        </button>
      </div>

      <div className="phase-strip">
        <div className="phase-badge">
          <div className="lbl">Program Day</div>
          <div className="val">{progDay >= 1 ? progDay : "—"}</div>
        </div>
        <div className="phase-badge">
          <div className="lbl">Week</div>
          <div className="val">{progDay >= 1 ? wk : "—"}</div>
        </div>
        <div className="phase-badge">
          <div className="lbl">Phase</div>
          <div className="val accentcolor">{progDay >= 1 ? phase.name : "—"}</div>
        </div>
      </div>

      {progDay < 1 ? (
        <div className="cta rest">
          <div className="cta-tag">Not Started Yet</div>
          <div className="cta-title">Set Your Start Date</div>
          <div className="cta-meta">Open ⚙ Settings to set Day 1, or jump to today.</div>
        </div>
      ) : sched.type === "day" && sched.dayId ? (
        (() => {
          const d = dayMeta(sched.dayId!)!;
          const doneThisDay = state.completions[sched.dayId!] === viewDateKey;
          return (
            <button className="cta" onClick={() => router.push(`/workouts/${d.id}?date=${viewDateKey}`)}>
              <div className="cta-icon">
                <ExerciseThumbRaw imgKey={d.exercises[0].img} />
              </div>
              <div className="cta-tag">
                {doneThisDay ? "Completed ✓ · Tap to review" : isToday ? "Today's Session" : "Scheduled Session"}
              </div>
              <div className="cta-title">
                Day {d.num} · {d.name}
              </div>
              <div className="cta-meta">{d.exercises.length} exercises · ~50–65 min</div>
              <div className="arrow">→</div>
            </button>
          );
        })()
      ) : (
        <div className="cta rest">
          <div className="cta-icon">
            <ExerciseThumbRaw imgKey={sched.img} />
          </div>
          <div className="cta-tag">{isToday ? "Today" : "Scheduled"}</div>
          <div className="cta-title">{sched.title}</div>
          <div className="cta-meta">{sched.sub}</div>
        </div>
      )}

      {progDay >= 1 && (
        <div className="info-box">
          <span className="tag">
            Week {effWk} · {phase.name} Phase
          </span>
          {phase.note}
        </div>
      )}

      <div className="stat-grid">
        <div className="stat-box">
          <div className="stat-num">{streak}</div>
          <div className="stat-cap">Day Streak</div>
        </div>
        <div className="stat-box">
          <div className="stat-num">{totalSessions}</div>
          <div className="stat-cap">Total Sessions</div>
        </div>
        <div className="stat-box">
          <div className="stat-num">{progDay >= 1 ? `${cycleCount}/4` : "—"}</div>
          <div className="stat-cap">This Cycle</div>
        </div>
      </div>

      <SectionHead title="Daily Non-Negotiables" />
      <div className="info-box">
        <span className="tag">Every Day</span>
        Build toward <b>8,000–10,000 steps</b> · Protein <b>1.6–2.0 g/kg</b> · Moderate calorie
        deficit · <b>7–9 hrs</b> sleep · Log every workout.
      </div>

      <div className="quote">
        &quot;Belly fat is lost by an overall calorie deficit + lifting + walking. You cannot
        spot-reduce it.&quot;
        <span>The honest big picture</span>
      </div>
    </section>
  );
}

/** Small inline helper — same visuals as ExerciseThumb but without the
 *  outer sizing wrapper, since .cta-icon supplies its own 56×56 box. */
function ExerciseThumbRaw({ imgKey }: { imgKey: string }) {
  const src = EX_IMG[imgKey];
  if (!src) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" />;
}
