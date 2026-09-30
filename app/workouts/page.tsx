"use client";

import { PROGRAM } from "@/lib/program-data";
import DayCard from "@/components/DayCard";
import SectionHead from "@/components/SectionHead";

export default function WorkoutsPage() {
  return (
    <section className="view">
      <div className="topbar">
        <div className="brand">WORKOUTS</div>
        <div className="daychip">4 Days</div>
      </div>
      <div className="hero-title" style={{ fontSize: 32 }}>
        The Program
      </div>
      <div className="hero-sub">
        Full-body split · every major muscle group trained twice weekly · ~50–65 min/session.
      </div>

      {PROGRAM.map((day) => (
        <DayCard key={day.id} day={day} />
      ))}

      <SectionHead title="Warm-Up — Every Session" />
      <div className="info-box">
        <span className="tag">Before Lifting</span>
        5 min easy walk/bike, then 1–2 light practice sets of the first exercise (~50% then ~70%
        of working weight).
      </div>
    </section>
  );
}
