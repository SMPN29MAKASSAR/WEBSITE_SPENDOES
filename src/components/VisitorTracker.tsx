"use client";
import { useEffect } from "react";

export default function VisitorTracker() {
  useEffect(() => {
    // Only track once per session
    if (!sessionStorage.getItem("tracked_visit")) {
      fetch("/api/track", { method: "POST" })
        .then(() => sessionStorage.setItem("tracked_visit", "true"))
        .catch(() => {});
    }
  }, []);
  return null;
}
