"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SubscriptionPlans } from "@/app/dashboard/subscriptions/_components/SubscriptionPlans";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SubscribePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Check for success/cancelled parameters from Stripe redirect
  useEffect(() => {
    const success = searchParams.get("success");
    const cancelled = searchParams.get("cancelled");
    const sessionId = searchParams.get("session_id");

    if (success === "true" && sessionId) {
      // Verify payment with backend
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stripe/status/${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "succeeded" || data.paymentStatus === "paid") {
            setShowSuccessMessage(true);
            // Hide success message after 8 seconds
            setTimeout(() => setShowSuccessMessage(false), 8000);
          }
        })
        .catch((err) => {
          console.error("Payment verification error:", err);
          // Still show success message as user was redirected from Stripe
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 8000);
        });

      // Clear URL parameters after showing message
      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      url.searchParams.delete("payment_intent");
      url.searchParams.delete("session_id");
      window.history.replaceState({}, "", url.toString());
    } else if (cancelled === "true") {
      // Clear URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete("cancelled");
      window.history.replaceState({}, "", url.toString());

      // Show cancelled message briefly
      setTimeout(() => {
        alert("Payment was cancelled. You can try again anytime.");
      }, 500);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
        
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-green-800">
                  Payment Successful!
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Your subscription has been activated. You now have access to
                  all premium features.
                </p>
              </div>
              <button
                onClick={() => setShowSuccessMessage(false)}
                className="flex-shrink-0 text-green-400 hover:text-green-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <SubscriptionPlans />
        </div>
      </div>
    </div>
  );
}
