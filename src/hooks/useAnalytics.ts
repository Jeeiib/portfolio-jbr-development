"use client";

type GTagEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

declare global {
  interface Window {
    gtag?: (
      command: "event",
      action: string,
      params: {
        event_category: string;
        event_label?: string;
        value?: number;
      }
    ) => void;
  }
}

export function useAnalytics() {
  const trackEvent = ({ action, category, label, value }: GTagEvent) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  // Événements prédéfinis pour le portfolio
  const trackCTAClick = (location: string) => {
    trackEvent({
      action: "cta_click",
      category: "engagement",
      label: location,
    });
  };

  const trackContactFormSubmit = () => {
    trackEvent({
      action: "contact_form_submit",
      category: "conversion",
      label: "contact_page",
    });
  };

  const trackProjectView = (projectName: string) => {
    trackEvent({
      action: "project_view",
      category: "engagement",
      label: projectName,
    });
  };

  const trackSocialClick = (platform: string) => {
    trackEvent({
      action: "social_click",
      category: "engagement",
      label: platform,
    });
  };

  const trackExternalLink = (url: string) => {
    trackEvent({
      action: "external_link_click",
      category: "navigation",
      label: url,
    });
  };

  return {
    trackEvent,
    trackCTAClick,
    trackContactFormSubmit,
    trackProjectView,
    trackSocialClick,
    trackExternalLink,
  };
}
