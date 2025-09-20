"use client";

import { useEffect, useState } from "react";
import "../lib/i18n";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Ensure i18n is initialized on client side
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
