"use client";

import { track } from "@vercel/analytics";

export type EventName =
  | "brief_start" | "brief_step" | "brief_submit"
  | "contact_submit" | "tel_click" | "whatsapp_click"
  | "google_review_click" | "project_view" | "cta_brief_click"
  | "cta_click" | "social_click" | "external_link_click";

export function useAnalytics() {
  function trackEvent(name: EventName, props?: Record<string, string | number>) {
    track(name, props);
  }
  return { trackEvent };
}
