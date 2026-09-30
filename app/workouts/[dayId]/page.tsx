import { Suspense } from "react";
import { PROGRAM } from "@/lib/program-data";
import WorkoutDetailClient from "@/components/WorkoutDetailClient";

/** Required for static export: enumerates every valid [dayId] at build time
 *  since there's no server left at runtime to resolve unknown paths. */
export function generateStaticParams() {
  return PROGRAM.map((d) => ({ dayId: d.id }));
}

export default function WorkoutDetailPage({ params }: { params: { dayId: string } }) {
  return (
    <Suspense fallback={<div className="skeleton-screen">Loading…</div>}>
      <WorkoutDetailClient dayId={params.dayId} />
    </Suspense>
  );
}
