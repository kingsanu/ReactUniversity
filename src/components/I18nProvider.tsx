"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGlobalStore } from "@/store/useGlobalStore";
import { SkipLink } from "@/components/accessibility/AccessibilityHelpers";
import { LanguageSync } from "@/components/accessibility/LanguageSync";
import "../lib/i18n";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { i18n } = useTranslation();
  const { language, setLanguage } = useGlobalStore();

  useEffect(() => {
    // Sync global store language with i18n on initial load
    const storedLanguage = language;
    const i18nLanguage = storedLanguage === "spanish" ? "es" : "en";

    if (i18n.language !== i18nLanguage) {
      i18n.changeLanguage(i18nLanguage);
    }

    setIsLoaded(true);
  }, []);

  // Listen for i18n language changes and sync to global store
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      const globalStoreLanguage = lng === "es" ? "spanish" : "english";
      if (language !== globalStoreLanguage) {
        setLanguage(globalStoreLanguage);
      }
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n, language, setLanguage]);

  if (!isLoaded) {
    return <>{children}</>;
  }

  return (
    <>
      <SkipLink />
      <LanguageSync />
      {children}
    </>
  );
}

