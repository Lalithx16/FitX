"use client";

import { useEffect, useRef } from "react";
import { MetricEntry } from "@/lib/types";

interface ProgressChartProps {
  data: MetricEntry[];
}

/**
 * Canvas line chart for weight/waist trends. Same visual language as the
 * original (gradient fill under an accent-colored line, gridlines, min/max
 * labels) but rendered at devicePixelRatio resolution so it stays crisp on
 * iPhone's high-density screens, and redraws responsively on container
 * resize and on theme change (it reads the live --accent CSS variable).
 */
export default function ProgressChart({ data }: ProgressChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const cssWidth = container.clientWidth;
      const cssHeight = 150;
      canvas.width = cssWidth * dpr;
      canvas.height = cssHeight * dpr;
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const W = cssWidth;
      const H = cssHeight;
      ctx.clearRect(0, 0, W, H);

      const rootStyles = getComputedStyle(document.documentElement);
      const lineColor = rootStyles.getPropertyValue("--line").trim() || "#262626";
      const accent = rootStyles.getPropertyValue("--accent").trim() || "#D8FF3E";
      const accentRgb = rootStyles.getPropertyValue("--accent-rgb").trim() || "216,255,62";

      const pad = 30;
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      for (let i = 0; i <= 3; i++) {
        const y = pad + ((H - 2 * pad) * i) / 3;
        ctx.beginPath();
        ctx.moveTo(pad, y);
        ctx.lineTo(W - pad, y);
        ctx.stroke();
      }

      if (data.length < 2) {
        ctx.fillStyle = "#5c5c60";
        ctx.font = "16px -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          data.length === 0 ? "Add entries to see your trend" : "Add one more entry to see trend",
          W / 2,
          H / 2
        );
        return;
      }

      const values = data.map((d) => d.value);
      let min = Math.min(...values);
      let max = Math.max(...values);
      if (min === max) {
        min -= 1;
        max += 1;
      }
      const range = max - min;

      const pts = data.map((d, i) => {
        const x = pad + ((W - 2 * pad) * i) / (data.length - 1);
        const y = H - pad - ((H - 2 * pad) * (d.value - min)) / range;
        return [x, y] as const;
      });

      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, `rgba(${accentRgb},0.35)`);
      grad.addColorStop(1, `rgba(${accentRgb},0)`);
      ctx.beginPath();
      ctx.moveTo(pts[0][0], H - pad);
      pts.forEach((p) => ctx.lineTo(p[0], p[1]));
      ctx.lineTo(pts[pts.length - 1][0], H - pad);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = accent;
      ctx.lineWidth = 3;
      ctx.lineJoin = "round";
      pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])));
      ctx.stroke();
      ctx.fillStyle = accent;
      pts.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p[0], p[1], 4, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = "#8E8E93";
      ctx.font = "11px -apple-system, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(max.toFixed(1), 2, pad + 4);
      ctx.fillText(min.toFixed(1), 2, H - pad + 4);
    };

    draw();

    const ro = new ResizeObserver(draw);
    ro.observe(container);

    // Redraw when the theme's CSS variables change (MutationObserver on
    // the <html> element's style attribute, set by AppStateContext).
    const mo = new MutationObserver(draw);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });

    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [data]);

  return (
    <div className="card" ref={containerRef}>
      <canvas ref={canvasRef} />
    </div>
  );
}
