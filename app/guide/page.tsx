"use client";

import { useState } from "react";
import { useAppState } from "@/context/AppStateContext";
import SectionHead from "@/components/SectionHead";
import Accordion from "@/components/Accordion";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function GuidePage() {
  const { resetAllData } = useAppState();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <section className="view">
      <div className="topbar">
        <div className="brand">GUIDE</div>
        <div className="daychip">Read First</div>
      </div>
      <div className="hero-title" style={{ fontSize: 32 }}>
        Rules Of
        <br />
        The Game
      </div>
      <div className="hero-sub">
        The honest big picture, how to progress, and the science behind the plan.
      </div>

      <div className="info-box safety">
        <span className="tag danger">Safety</span>
        If you have any medical condition (heart, blood pressure, diabetes, joint problems) or
        feel chest pain, dizziness or sharp joint pain — check with a doctor first / stop the
        exercise.
      </div>

      <SectionHead title="The Honest Big Picture" />
      <Accordion title="Fat loss & recomposition">
        <ul>
          <li>
            Belly fat is lost by an overall calorie deficit + lifting + walking. You cannot
            spot-reduce fat with crunches — ab work builds the muscle, fat loss reveals it.
          </li>
          <li>
            As a beginner with extra body fat, you can lose fat <b>and</b> build muscle at the
            same time (&quot;recomposition&quot;). Progress is best in the first 6–12 months.
          </li>
          <li>
            You will not get &quot;too bulky&quot; by accident — that takes years of heavy eating
            and hard training. In a fat-loss phase you&apos;ll look leaner and more defined, not
            huge.
          </li>
          <li>
            Weekly fat-loss target: about{" "}
            <span className="hl">0.25–0.75 kg (0.5–1.5 lb)/week</span>. Faster tends to cost
            muscle and energy.
          </li>
        </ul>
      </Accordion>

      <SectionHead title="Your Day-Number Engine" />
      <Accordion title="How the schedule works">
        Every date maps to a <b>Program Day number</b> counted from your start date (set it in ⚙
        Settings). Program days repeat on a 7-day cycle:
        <ul>
          <li>Day 1 → Upper A · Day 2 → Lower A · Day 3 → Rest + walk</li>
          <li>Day 4 → Upper B · Day 5 → Rest or light cardio · Day 6 → Lower B + Arms · Day 7 → Rest + walk</li>
        </ul>
        Every 7 program days = 1 training week. Every 12 training weeks = 1 full cycle, tying into
        the phase system below. Enter any day number (e.g. <b>Day 40</b>) on the Home tab to
        preview exactly what that day calls for, however far in the future.
      </Accordion>

      <SectionHead title="Rules For Every Workout" />
      <Accordion title="Effort (RIR)">
        &quot;RIR&quot; = reps you could still do with good form. Weeks 1–2: ~3 RIR while learning
        technique. Weeks 3+: ~2 RIR on most working sets. Isolation exercises can occasionally
        reach ~1 RIR on the final set. Failure isn&apos;t required — consistency and progressive
        overload matter more.
      </Accordion>
      <Accordion title="Rest Periods">
        Compounds: 2–3 min · Machine/secondary lifts: ~2 min · Arms/shoulders: 60–120 sec. Rest
        longer if performance is dropping.
      </Accordion>
      <Accordion title="Speed & Range">
        Lower the weight under control for ~2–3 sec and lift smoothly/strongly — no artificially
        slow tempo. Use the largest comfortable, controlled, pain-free range you can own.
      </Accordion>
      <Accordion title="Form First">
        If technique breaks down, reduce the load. Ask a qualified trainer to check unfamiliar
        setups during the first week if needed.
      </Accordion>

      <SectionHead title="How To Progress" />
      <Accordion title="Double Progression">
        Each exercise has a rep range. Stay with a weight until you can do the top of the range on
        ALL sets with good form (~2 reps left in the tank), then increase the weight slightly.
        <br />
        <br />
        <b>Example</b> — Incline DB Press 3×6–10 at 14 kg:
        <br />
        Week 1: 8/7/6 → Week 2: 9/8/7 → Week 3: 10/9/8 → Week 4: 10/10/10 → move up to 16 kg, reps
        drop, build back up.
        <br />
        <br />
        Log every workout (weight × reps) using the set-log fields on each exercise card.
      </Accordion>

      <SectionHead title="Evidence-Based Notes" />
      <Accordion title="Why this plan is built this way">
        <ul>
          <li>
            Progressive resistance training strongly improves strength and muscle size.
            Hypertrophy is enhanced by higher weekly volume (~10+ sets/week), with strength tied
            to heavier loading, complete ROM, multiple sets, training ≥2×/week.
          </li>
          <li>
            Frequency mainly distributes volume — when weekly volume is equal, frequency alone has
            little hypertrophy advantage. Upper/Lower ×2 is chosen for manageable sessions and
            recovery, not because muscles must be trained exactly twice weekly.
          </li>
          <li>
            Sets should be reasonably close to failure, but failure every set is unnecessary. ~2
            RIR with occasional ~1 RIR isolation work balances stimulus and fatigue for a
            beginner.
          </li>
          <li>
            During fat loss, resistance training reduces loss of fat-free mass and improves
            strength vs. dieting alone.
          </li>
          <li>
            Protein ~1.6–2.0 g/kg/day — benefits level off around ~1.6 g/kg for many, though
            higher intake can help during energy restriction.
          </li>
          <li>
            No rigid ultra-slow tempo is assigned — controlled reps and adequate effort matter
            more than a fixed tempo sequence.
          </li>
        </ul>
      </Accordion>

      <SectionHead title="About This Plan" />
      <div className="info-box">
        Beginner Lean &amp; Fit Plan (4 days/week) — reduce body fat, build/retain muscle, improve
        upper-body strength and develop a balanced physique.
      </div>

      <button
        className="finish-btn danger"
        style={{ marginTop: 6 }}
        onClick={() => setConfirmOpen(true)}
      >
        Reset All Data
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title="Reset All Data?"
        message="This clears all logged progress, completed sessions, and set history. Your theme choice is kept. This cannot be undone."
        confirmLabel="Reset Everything"
        danger
        onConfirm={() => {
          resetAllData();
          setConfirmOpen(false);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </section>
  );
}
