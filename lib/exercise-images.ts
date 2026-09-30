/**
 * Maps the short `img` keys used in program-data.ts to their static asset
 * path under /public/exercises. Extracted from the original app's inline
 * base64 EX_IMG object into real files — this alone removes ~700KB of
 * base64 text from the JS bundle and lets the browser cache each image
 * individually instead of re-parsing it on every page.
 */
export const EX_IMG: Record<string, string> = {
  cable_curl: "/exercises/cable_curl.webp",
  cable_fly: "/exercises/cable_fly.webp",
  calf_raise: "/exercises/calf_raise.webp",
  chest_supported_row: "/exercises/chest_supported_row.webp",
  db_shoulder_press: "/exercises/db_shoulder_press.webp",
  flat_db_press: "/exercises/flat_db_press.webp",
  goblet_squat: "/exercises/goblet_squat.webp",
  hammer_curl: "/exercises/hammer_curl.webp",
  hanging_knee_raise: "/exercises/hanging_knee_raise.webp",
  hip_thrust: "/exercises/hip_thrust.webp",
  incline_db_curl: "/exercises/incline_db_curl.webp",
  incline_db_press: "/exercises/incline_db_press.webp",
  lat_pulldown: "/exercises/lat_pulldown.webp",
  lateral_raise: "/exercises/lateral_raise.webp",
  leg_extension: "/exercises/leg_extension.webp",
  leg_press: "/exercises/leg_press.webp",
  light_cardio: "/exercises/light_cardio.webp",
  machine_shoulder_press: "/exercises/machine_shoulder_press.webp",
  oh_triceps_ext: "/exercises/oh_triceps_ext.webp",
  pullup: "/exercises/pullup.webp",
  rdl: "/exercises/rdl.webp",
  rear_delt_fly: "/exercises/rear_delt_fly.webp",
  rest_walk: "/exercises/rest_walk.webp",
  seated_cable_row: "/exercises/seated_cable_row.webp",
  seated_leg_curl: "/exercises/seated_leg_curl.webp",
  triceps_pushdown: "/exercises/triceps_pushdown.webp",
};
