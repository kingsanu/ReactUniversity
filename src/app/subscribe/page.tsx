"use client";

import { useRouter } from "next/navigation";
import { SubscriptionPlans } from "@/app/dashboard/subscriptions/_components/SubscriptionPlans";
import { Button } from "@/components/ui/button";

export default function SubscribePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <SubscriptionPlans />
        </div>
      </div>
    </div>
  );
}
