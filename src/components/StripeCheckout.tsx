"use client";
import React, { useState } from "react";

interface StripeCheckoutProps {
  amount: number; // in cents
  productName: string;
  userId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function StripeCheckout({
  amount,
  productName,
  userId,
  onSuccess,
  onError,
  onStart,
  children,
  className = "",
  disabled = false,
}: StripeCheckoutProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (disabled || loading) return;

    setLoading(true);
    onStart?.();

    try {
      // Create checkout session
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            userId,
            amount,
            currency: "usd",
            productName,
            successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${window.location.origin}/payment-cancelled`,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Checkout session created:", data);

      if (data.sessionUrl) {
        // Redirect to Stripe Checkout
        window.location.href = data.sessionUrl;
      } else {
        throw new Error("No session URL received from server");
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to initialize payment";
      onError?.(errorMessage);
      setLoading(false);
    }
    // Note: We don't set loading to false on success because we're redirecting
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={disabled || loading}
      className={className}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Redirecting to Stripe...</span>
        </div>
      ) : (
        children || "Pay with Stripe"
      )}
    </button>
  );
}
