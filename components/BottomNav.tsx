"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Home", icon: "⌂", match: (p: string) => p === "/" },
  {
    href: "/workouts",
    label: "Workouts",
    icon: "▤",
    match: (p: string) => p.startsWith("/workouts"),
  },
  { href: "/fuel", label: "Fuel", icon: "◈", match: (p: string) => p.startsWith("/fuel") },
  {
    href: "/progress",
    label: "Progress",
    icon: "▲",
    match: (p: string) => p.startsWith("/progress"),
  },
  { href: "/guide", label: "Guide", icon: "✓", match: (p: string) => p.startsWith("/guide") },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="tabbar" aria-label="Primary">
      <div className="tabbar-inner">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`tab-btn ${active ? "active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <span className="ic" aria-hidden="true">
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
