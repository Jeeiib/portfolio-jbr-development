"use client";

import { useEffect } from "react";

interface LangUpdaterProps {
  locale: string;
}

export function LangUpdater({ locale }: LangUpdaterProps) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
