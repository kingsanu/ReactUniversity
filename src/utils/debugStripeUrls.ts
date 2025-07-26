/**
 * Debug utility to check Stripe URL configuration
 */
export function debugStripeUrls() {
  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "undefined";
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const successUrl = `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${baseUrl}/payment-cancelled`;

  const debugInfo = {
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_API_BASE_URL: apiBaseUrl,
    },
    urls: {
      baseUrl,
      successUrl,
      cancelUrl,
    },
    validation: {
      isAbsoluteSuccess: successUrl.startsWith("http"),
      isAbsoluteCancel: cancelUrl.startsWith("http"),
      hasValidProtocol:
        baseUrl.startsWith("http://") || baseUrl.startsWith("https://"),
    },
  };

  console.log("🔍 Stripe URL Debug Info:", debugInfo);

  return debugInfo;
}

/**
 * Get safe absolute URLs for Stripe checkout
 */
export function getSafeStripeUrls() {
  let baseUrl = "";

  // Try multiple methods to get the base URL
  if (typeof window !== "undefined") {
    // Method 1: window.location.origin
    if (
      window.location &&
      window.location.origin &&
      window.location.origin !== "null"
    ) {
      baseUrl = window.location.origin;
    }
    // Method 2: Construct from protocol + host
    else if (
      window.location &&
      window.location.protocol &&
      window.location.host
    ) {
      baseUrl = `${window.location.protocol}//${window.location.host}`;
    }
    // Method 3: Try to get from href
    else if (window.location && window.location.href) {
      try {
        const url = new URL(window.location.href);
        baseUrl = `${url.protocol}//${url.host}`;
      } catch (e) {
        console.warn("Failed to parse window.location.href:", e);
      }
    }
  }

  // Fallback to environment variable or localhost
  if (
    !baseUrl ||
    baseUrl === "undefined" ||
    baseUrl === "null" ||
    !baseUrl.startsWith("http")
  ) {
    const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (envUrl && envUrl !== "undefined") {
      baseUrl = envUrl;
      // Ensure protocol is included
      if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
        baseUrl = `https://${baseUrl}`;
      }
    } else {
      // Last resort - localhost
      baseUrl = "http://localhost:3000";
      console.warn("⚠️ Using localhost fallback for Stripe URLs");
    }
  }

  // Clean up the baseUrl
  baseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash

  // Additional validation
  if (!baseUrl || baseUrl === "undefined" || baseUrl === "null") {
    console.error("❌ Could not determine base URL for Stripe checkout");
    throw new Error("Invalid base URL for Stripe checkout");
  }

  // Validate it's a proper URL
  try {
    new URL(baseUrl);
  } catch (e) {
    console.error("❌ Invalid base URL format:", baseUrl);
    throw new Error(`Invalid base URL format: ${baseUrl}`);
  }

  const successUrl = `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${baseUrl}/payment-cancelled`;

  console.log("🔗 Safe Stripe URLs:", { baseUrl, successUrl, cancelUrl });

  // Final validation - URLs must be absolute
  if (!successUrl.startsWith("http") || !cancelUrl.startsWith("http")) {
    console.error("❌ Generated URLs are not absolute:", {
      successUrl,
      cancelUrl,
    });
    throw new Error("Generated URLs must be absolute");
  }

  return { successUrl, cancelUrl, baseUrl };
}
