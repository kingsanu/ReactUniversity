import type { Metadata } from "next";
import { montserrat, roboto, geistSans, geistMono, antonio } from "./fonts";
import "./globals.css";
import { AuthWrapper } from "@/components/AuthWrapper";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { QueryProvider } from "@/components/QueryProvider";
import { AssessmentCacheProvider } from "@/contexts/AssessmentCacheContext";
import { I18nProvider } from "@/components/I18nProvider";
import { TelemetryProvider } from "@/components/TelemetryProvider";
import { SkipToMain } from "@/components/ui/accessibility";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "TimCare - Career Development Platform",
    template: "%s | TimCare",
  },
  description:
    "Accelerate your career with personalized learning paths, skill assessments, and market insights.",
  keywords: [
    "career development",
    "skill assessment",
    "learning platform",
    "job market",
    "resume builder",
  ],
  authors: [{ name: "TimCare" }],
  creator: "TimCare",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "TimCare",
    title: "TimCare - Career Development Platform",
    description:
      "Accelerate your career with personalized learning paths, skill assessments, and market insights.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TimCare - Career Development Platform",
    description:
      "Accelerate your career with personalized learning paths, skill assessments, and market insights.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${antonio.variable} ${roboto.variable} antialiased`}
      >
        <SkipToMain mainId="main-content" />
        <ErrorBoundary>
          <QueryProvider>
            <AssessmentCacheProvider>
              <I18nProvider>
                <TelemetryProvider>
                  <AuthWrapper>{children}</AuthWrapper>
                </TelemetryProvider>
              </I18nProvider>
            </AssessmentCacheProvider>
          </QueryProvider>
        </ErrorBoundary>
        <Toaster richColors closeButton position="top-right" />
      </body>
    </html>
  );
}
