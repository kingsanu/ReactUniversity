"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SubscribePromptPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Subscription required</h2>
        <p className="text-gray-600 mb-4">
          To access the dashboard features, please subscribe to one of our plans.
        </p>
        <div className="flex justify-center gap-3">
          <Button onClick={() => router.push("/dashboard/subscriptions")}>Choose a plan</Button>
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>Go back</Button>
        </div>
        <p className="text-xs text-gray-400 mt-4">You can try our free trial if available.</p>
      </div>
    </div>
  );
}
