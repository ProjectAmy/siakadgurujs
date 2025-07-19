"use client";
import { useEffect } from "react";

export default function DashboardFragmentCleanup() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);
  return null;
}
