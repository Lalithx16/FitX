import Image from "next/image";
import { EX_IMG } from "@/lib/exercise-images";

interface ExerciseThumbProps {
  imgKey: string;
  alt: string;
  size?: "small" | "large";
}

/** The glowing, gently-bobbing exercise thumbnail used on day cards,
 *  the home CTA and each exercise card. */
export default function ExerciseThumb({ imgKey, alt, size = "large" }: ExerciseThumbProps) {
  const src = EX_IMG[imgKey];
  const px = size === "small" ? 36 : 48;
  if (!src) return null;
  return (
    <div className={`ex-thumb-wrap ${size === "small" ? "small" : ""}`}>
      <div className="ex-thumb-glow" />
      <Image className="ex-thumb" src={src} alt={alt} width={px} height={px} unoptimized />
    </div>
  );
}
