"use client";

import { useReportWebVitals } from "next/web-vitals";

export function VitalsReporter() {
  useReportWebVitals((metric) => {
    const payload = {
      id: metric.id,
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      navigationType: metric.navigationType,
      path: window.location.pathname,
    };
    if (process.env.NODE_ENV === "development") console.info("[Web Vital]", payload);
    if (navigator.sendBeacon) navigator.sendBeacon("/api/vitals", new Blob([JSON.stringify(payload)], { type: "application/json" }));
  });
  return null;
}
