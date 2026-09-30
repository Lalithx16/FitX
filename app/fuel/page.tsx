"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useAppState } from "@/context/AppStateContext";
import SectionHead from "@/components/SectionHead";
import Accordion from "@/components/Accordion";

export default function FuelPage() {
  const { state, setBodyWeight } = useAppState();
  const [bwInput, setBwInput] = useState<string>(state.bw ? String(state.bw) : "");

  // Defensive resync for ONE specific external change only: `state.bw`
  // being cleared back to null (Reset All Data). We deliberately do NOT
  // resync on every `state.bw` change — this component is itself the only
  // thing that ever sets a non-null bw, and re-deriving `bwInput` from
  // `String(state.bw)` on every keystroke would fight the user's own typing
  // (e.g. snapping "70." back to "70" while they're mid-edit toward "70.5").
  useEffect(() => {
    if (state.bw === null) setBwInput("");
  }, [state.bw]);

  const bw = parseFloat(bwInput);
  const hasValidBw = Boolean(bw) && bw > 0;
  const lo = hasValidBw ? Math.round(bw * 1.6) : null;
  const hi = hasValidBw ? Math.round(bw * 2.0) : null;

  function handleChange(value: string) {
    setBwInput(value);
    const parsed = parseFloat(value);
    if (parsed && parsed > 0) setBodyWeight(parsed);
  }

  return (
    <section className="view">
      <div className="topbar">
        <div className="brand">FUEL</div>
        <div className="daychip">Sec. 7</div>
      </div>
      <div className="hero-title" style={{ fontSize: 32 }}>
        Food &amp; Steps
      </div>
      <div className="hero-sub">The gym builds the muscle. Food and daily steps do the fat loss.</div>

      <div className="card">
        <div className="card-label">Your Protein Target</div>
        <div className="input-row" style={{ marginTop: 10 }}>
          <input
            type="number"
            inputMode="decimal"
            placeholder="Body weight (kg)"
            value={bwInput}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
          />
        </div>
        <div>
          <div className="card-value">
            {hasValidBw ? `${lo}–${hi}` : "—"}
            <span className="card-unit">g/day</span>
          </div>
          <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
            Range: 1.6–2.0 g/kg/day, across 3–4 meals
          </div>
        </div>
      </div>

      <SectionHead title="Guidelines" />

      <Accordion title="Calories & Deficit">
        Start with a moderate deficit — commonly <b>300–500 kcal/day</b> below maintenance. Treat
        this as a starting estimate; adjust based on your 2–3 week weight trend, waist and
        recovery.
        <ul>
          <li>
            Weekly loss <span className="hl">under 0.25 kg</span> for 2–3 weeks → trim ~150–200
            kcal or add ~2,000 steps/day.
          </li>
          <li>
            Weekly loss <span className="hl">over ~0.75 kg</span> → eat a bit more.
          </li>
          <li>
            Weigh yourself 3–4 mornings/week, use the <b>weekly average</b>, not single days.
          </li>
        </ul>
        Target weekly fat-loss rate: <span className="hl">0.25–0.75 kg (0.5–1.5 lb)/week.</span>
      </Accordion>

      <Accordion title="Protein">
        Practical target: <b>1.6–2.0 g/kg/day</b>, spread across 3–4 meals. If current body weight
        would clearly overestimate needs due to substantial excess body fat, use a reasonable
        goal/target weight instead.
        <br />
        <br />
        Easy sources: eggs, chicken, fish, paneer, dal/legumes, curd/Greek yogurt, tofu, whey
        (optional).
      </Accordion>

      <Accordion title="Building Your Meals">
        Build every meal around: <b>protein + vegetables + a moderate carb portion + some healthy
        fat</b>.
        <ul>
          <li>Cut the easy calories first: sugary drinks, juices, sweets, deep-fried snacks, most alcohol.</li>
          <li>No need to ban foods — keep ~80% of meals simple/whole, leave room for normal life.</li>
          <li>Eat slowly, avoid large late-night snacking.</li>
        </ul>
      </Accordion>

      <Accordion title="Daily Steps">
        Target <b>8,000–10,000 steps/day</b> — the easiest and most sustainable fat-loss tool.
        Build up gradually (+1,000 steps every week or two).
      </Accordion>

      <Accordion title="Optional Cardio">
        2–3 sessions/week, 20–30 min at an easy-to-moderate pace (brisk incline walk, cycling). You
        should be able to speak in short sentences. Do it on rest days or after lifting — don&apos;t
        let it drain your lifting energy.
      </Accordion>

      <Accordion title="Creatine (Optional)">
        Creatine monohydrate <b>3–5 g/day</b> is safe for most healthy adults and helps strength
        and muscle. May cause 1–2 kg water-weight gain — that is not fat. Skip if you have kidney
        problems or your doctor advises against it.
      </Accordion>

      <Accordion title="Sleep & Stress">
        <b>7–9 hours</b> sleep. Poor sleep raises hunger and lowers recovery.
      </Accordion>

      <SectionHead title="Common Beginner Mistakes" />
      <div className="info-box">
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>Skipping workouts, then doing extra the next day.</li>
          <li>Swapping exercises every week — you can&apos;t measure progress.</li>
          <li>Ego lifting: swinging, bouncing, half reps.</li>
          <li>Under-eating protein, or crash dieting and losing muscle.</li>
          <li>Relying on crunches/&quot;belly fat&quot; moves instead of the calorie deficit.</li>
          <li>Comparing yourself to advanced lifters — compare only to your own log.</li>
        </ul>
      </div>
    </section>
  );
}
