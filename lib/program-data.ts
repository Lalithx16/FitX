import { WorkoutDay, CycleItem, Theme } from "./types";

/**
 * The 4-day training split. Ported 1:1 from the original app's PROGRAM
 * constant — exercise names, set/rep schemes, rest periods and coaching
 * cues are unchanged.
 */
export const PROGRAM: WorkoutDay[] = [
  {
    id: "day1",
    num: "1",
    name: "Upper A",
    focus: "Strength · Upper-body priority",
    exercises: [
      {
        name: "Incline Dumbbell Press",
        scheme: "3 × 6–10",
        rest: "2–3 min",
        img: "incline_db_press",
        cue: "Bench 20–35°. Upper back supported, shoulder blades controlled. Lower under control to a comfortable chest stretch, then press smoothly. Keep elbows moderately tucked; do not bounce.",
      },
      {
        name: "Lat Pulldown (medium/neutral grip)",
        scheme: "3 × 8–12",
        rest: "2 min",
        img: "lat_pulldown",
        cue: "Secure thighs. Pull elbows toward ribs with chest tall. Control the return and allow the lats to lengthen. Never pull behind the neck.",
      },
      {
        name: "Chest-Supported Row",
        scheme: "3 × 8–12",
        rest: "2 min",
        img: "chest_supported_row",
        cue: "Chest stays supported. Pull elbows toward the torso, pause briefly, then control the return. Do not use torso momentum.",
      },
      {
        name: "Machine Shoulder Press",
        scheme: "2 × 8–12",
        rest: "2 min",
        img: "machine_shoulder_press",
        cue: "Handles start around shoulder level. Press smoothly without excessive lower-back arching. Use a pain-free range.",
      },
      {
        name: "Cable / DB Lateral Raise",
        scheme: "2 × 12–20",
        rest: "60–90 sec",
        img: "lateral_raise",
        cue: "Light load. Raise the upper arm out to the side without shrugging or swinging. Stop around shoulder height if comfortable.",
      },
      {
        name: "Incline Dumbbell Curl",
        scheme: "2 × 8–12",
        rest: "60–90 sec",
        img: "incline_db_curl",
        cue: "Keep upper arms relatively still. Curl smoothly and lower slowly.",
      },
      {
        name: "Overhead Cable Triceps Extension",
        scheme: "2 × 10–15",
        rest: "60–90 sec",
        img: "oh_triceps_ext",
        cue: "Keep upper arms stable, allow the triceps to lengthen, then extend the elbows smoothly.",
      },
    ],
  },
  {
    id: "day2",
    num: "2",
    name: "Lower A",
    focus: "Quad + posterior chain · Moderate",
    exercises: [
      {
        name: "Leg Press or Hack Squat",
        scheme: "3 × 8–12",
        rest: "2–3 min",
        img: "leg_press",
        cue: "Feet stable and knees track with toes. Descend as deeply as you can while keeping the pelvis controlled. Drive through the whole foot.",
      },
      {
        name: "Dumbbell Romanian Deadlift",
        scheme: "3 × 8–12",
        rest: "2–3 min",
        img: "rdl",
        cue: "Soft knees, hips travel backward, dumbbells stay close to the legs. Lower only as far as you can maintain a neutral trunk and feel the hamstrings lengthen. Start light and learn the hinge.",
      },
      {
        name: "Seated Leg Curl",
        scheme: "2 × 10–15",
        rest: "90–120 sec",
        img: "seated_leg_curl",
        cue: "Align the knee with the machine pivot, keep hips down and curl smoothly. Control the return.",
      },
      {
        name: "Leg Extension",
        scheme: "2 × 12–15",
        rest: "60–90 sec",
        img: "leg_extension",
        cue: "Align the knee with the pivot, extend smoothly, pause briefly near the top, and lower under control.",
      },
      {
        name: "Standing or Machine Calf Raise",
        scheme: "3 × 10–15",
        rest: "60–120 sec",
        img: "calf_raise",
        cue: "Controlled stretch at the bottom, strong contraction at the top. No bouncing.",
      },
      {
        name: "Cable Crunch",
        scheme: "2 × 10–15",
        rest: "60–90 sec",
        img: "hanging_knee_raise",
        cue: "Curl the rib cage toward the pelvis. Do not simply pull the rope down with the arms.",
      },
    ],
  },
  {
    id: "day3",
    num: "3",
    name: "Upper B",
    focus: "Hypertrophy + arms",
    exercises: [
      {
        name: "Flat Dumbbell Press or Machine Chest Press",
        scheme: "3 × 8–12",
        rest: "2 min",
        img: "flat_db_press",
        cue: "Shoulder blades controlled, elbows moderately tucked, smooth press.",
      },
      {
        name: "Seated Cable Row",
        scheme: "3 × 8–12",
        rest: "2 min",
        img: "seated_cable_row",
        cue: "Sit tall, pull toward the lower ribs/upper abdomen, squeeze the mid-back, and return without torso swinging.",
      },
      {
        name: "Neutral-Grip Pulldown OR Assisted Pull-Up",
        scheme: "3 × 6–12",
        rest: "2 min",
        img: "pullup",
        cue: "Use a load/assistance level that allows controlled reps. Gradually add reps or reduce assistance over time.",
      },
      {
        name: "Cable Chest Fly",
        scheme: "2 × 10–15",
        rest: "60–90 sec",
        img: "cable_fly",
        cue: "Small consistent elbow bend, controlled stretch and smooth arm arc.",
      },
      {
        name: "Rear-Delt Fly / Reverse Pec Deck",
        scheme: "2 × 12–20",
        rest: "60–90 sec",
        img: "rear_delt_fly",
        cue: "Move the upper arms rather than shrugging. Keep the torso stable.",
      },
      {
        name: "Cable Biceps Curl",
        scheme: "2 × 10–15",
        rest: "60–90 sec",
        img: "cable_curl",
        cue: "Elbows stay near the sides; curl without leaning backward.",
      },
      {
        name: "Triceps Pushdown",
        scheme: "2 × 10–15",
        rest: "60–90 sec",
        img: "triceps_pushdown",
        cue: "Upper arms stay relatively fixed; extend the elbows fully but smoothly.",
      },
    ],
  },
  {
    id: "day4",
    num: "4",
    name: "Arms, Shoulders, Legs-Lite & Core",
    focus: "Lower B + Arms/Shoulders",
    exercises: [
      {
        name: "Goblet Squat or Split Squat",
        scheme: "2 × 8–12",
        rest: "2 min",
        img: "goblet_squat",
        cue: "Controlled depth, stable foot, knee tracks naturally over the foot. Use the split squat for more unilateral work.",
      },
      {
        name: "Hip Thrust or Glute Bridge",
        scheme: "2 × 8–12",
        rest: "2 min",
        img: "hip_thrust",
        cue: "Drive through the whole foot and extend the hips. Finish with ribs stacked over pelvis; do not hyperextend the lower back.",
      },
      {
        name: "Leg Curl (seated or lying)",
        scheme: "2 × 10–15",
        rest: "90–120 sec",
        img: "seated_leg_curl",
        cue: "Smooth curl, controlled lengthening, hips remain stable.",
      },
      {
        name: "Seated Dumbbell Shoulder Press",
        scheme: "2 × 8–12",
        rest: "2 min",
        img: "db_shoulder_press",
        cue: "Press smoothly through a comfortable range. Do not turn it into a lower-back exercise.",
      },
      {
        name: "Hammer Curl",
        scheme: "3 × 8–12",
        rest: "60–90 sec",
        img: "hammer_curl",
        cue: "Neutral grip, elbows stable, no swinging.",
      },
      {
        name: "Lateral Raise",
        scheme: "2 × 12–20",
        rest: "60–90 sec",
        img: "lateral_raise",
        cue: "Light load, no shrugging or momentum.",
      },
      {
        name: "Overhead Cable Triceps Extension",
        scheme: "2 × 10–15",
        rest: "60–90 sec",
        img: "oh_triceps_ext",
        cue: "Controlled stretch and elbow extension.",
      },
      {
        name: "Hanging Knee Raise or Cable Crunch",
        scheme: "2 × 10–15",
        rest: "60 sec",
        img: "hanging_knee_raise",
        cue: "Move from the trunk/hips under control; avoid swinging.",
      },
    ],
    optional:
      "Optional: 10–20 min easy-to-moderate incline walk or bike if recovery is good.",
  },
];

/** 7-day repeating cycle. Index = (programDay - 1) % 7. */
export const WEEKLY_CYCLE: CycleItem[] = [
  { type: "day", dayId: "day1", label: "Upper A", img: "incline_db_press" },
  { type: "day", dayId: "day2", label: "Lower A", img: "leg_press" },
  { type: "rest", title: "Rest + Walk", sub: "30–40 min easy walk", img: "rest_walk" },
  { type: "day", dayId: "day3", label: "Upper B", img: "flat_db_press" },
  { type: "cardio", title: "Rest or Light Cardio", sub: "20–30 min easy-moderate", img: "light_cardio" },
  { type: "day", dayId: "day4", label: "Lower B + Arms", img: "goblet_squat" },
  { type: "rest", title: "Rest + Walk", sub: "Recovery day", img: "rest_walk" },
];

export const THEMES: Theme[] = [
  { id: "volt", name: "Volt", accent: "#D8FF3E", rgb: "216,255,62", ink: "#0a0a0a" },
  { id: "crimson", name: "Crimson", accent: "#FF3B3B", rgb: "255,59,59", ink: "#0a0a0a" },
  { id: "azure", name: "Azure", accent: "#3FA7FF", rgb: "63,167,255", ink: "#08111a" },
  { id: "sunset", name: "Sunset", accent: "#FF8A3D", rgb: "255,138,61", ink: "#1a0e05" },
  { id: "pink", name: "Pink", accent: "#FF4FA3", rgb: "255,79,163", ink: "#1a0311" },
  { id: "mono", name: "Mono", accent: "#F5F5F5", rgb: "245,245,245", ink: "#0a0a0a" },
];

export function dayMeta(dayId: string): WorkoutDay | undefined {
  return PROGRAM.find((d) => d.id === dayId);
}
