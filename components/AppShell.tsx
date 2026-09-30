"use client";

import { useEffect } from "react";
import { AppStateProvider, useAppState } from "@/context/AppStateContext";
import BottomNav from "./BottomNav";
import SettingsSheet from "./SettingsSheet";

function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    // Register after load so it never competes with the initial paint.
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Non-fatal — the app still works fully online without the SW,
        // it just won't have the offline app-shell cache.
      });
    });
  }, []);
  return null;
}

function Gate({ children }: { children: React.ReactNode }) {
  const { hydrated } = useAppState();
  if (!hydrated) {
    return <div className="skeleton-screen">Loading LEAN&amp;FIT…</div>;
  }
  return <>{children}</>;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppStateProvider>
      <ServiceWorkerRegister />
      <div id="app-shell">
        <Gate>{children}</Gate>
      </div>
      <SettingsSheet />
      <BottomNav />
    </AppStateProvider>
  );
}
