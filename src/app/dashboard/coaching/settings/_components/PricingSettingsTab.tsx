"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, Info } from "lucide-react";
import { toast } from "sonner";
import { useGlobalStore } from "@/store/useGlobalStore";

interface PricingSettingsTabProps {
  coachDetails?: any | null;
  isLoading?: boolean;
  onUpdated?: (newData: any) => void;
}

export function PricingSettingsTab({
  coachDetails,
  isLoading: isParentLoading,
  onUpdated,
}: PricingSettingsTabProps) {
  const { user, platformFee, fetchSettings } = useGlobalStore();
  const [hourlyRate, setHourlyRate] = useState<number>(0);
  const currency = "USD";
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Fetch platform fee settings
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (coachDetails) {
      setHourlyRate(coachDetails.hourlyRate || 0);
      setIsLoading(false);
      return;
    }

    const fetchPricing = async () => {
      try {
        setIsLoading(true);
        const { getCoachDetails } = await import("@/services/coachService");
        if (user?.id) {
          const data = await getCoachDetails(user.id);
          if (data) {
            setHourlyRate(data.hourlyRate || 0);
            if (onUpdated) onUpdated(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch pricing:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchPricing();
    }
  }, [user?.id, coachDetails]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { updateCoachProfile } = await import("@/services/coachService");
      const updatedResponse: any = await updateCoachProfile({
        hourlyRate,
        currency,
      });
      // If update returned an updated coach details, notify parent; otherwise re-fetch
      try {
        if (updatedResponse && typeof updatedResponse === "object") {
          if (onUpdated) onUpdated(updatedResponse?.data || updatedResponse);
        } else if (user?.id) {
          const { getCoachDetails } = await import("@/services/coachService");
          const reloaded = await getCoachDetails(user.id);
          if (reloaded && onUpdated) onUpdated(reloaded);
        }
      } catch (e) {
        // swallow: best-effort refresh
        console.warn("Failed to refresh coach details after save", e);
      }
      toast.success("Pricing updated successfully");
    } catch (error) {
      console.error("Failed to update pricing:", error);
      toast.error("Failed to update pricing");
    } finally {
      setIsSaving(false);
    }
  };

  // Earnings Breakdown
  const feeAmount = (hourlyRate * platformFee) / 100;
  const yourEarnings = hourlyRate - feeAmount;

  if (isParentLoading || isLoading) {
    return <div className="p-8 text-center">Loading pricing...</div>;
  }

  return (
    <div className="p-6 sm:p-10 space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Pricing Settings</h2>
        <p className="text-gray-500 font-medium mt-1">
          Set your hourly rate and currency for coaching sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <Label htmlFor="currency" className="text-sm font-semibold text-gray-700">Currency</Label>
          <Select value="USD" disabled>
            <SelectTrigger className="h-12 rounded-xl bg-white border-gray-200">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label htmlFor="rate" className="text-sm font-semibold text-gray-700">Hourly Rate</Label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="rate"
              type="number"
              min="0"
              step="0.01"
              className="pl-12 h-12 rounded-xl bg-white border-gray-200 text-lg font-medium"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
            />
          </div>
          <p className="text-xs text-blue-600 font-medium">
            This is what clients will see when booking.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
          <div>
             <h3 className="font-bold text-gray-900">Earnings Breakdown</h3>
             <p className="text-sm text-gray-500 font-medium">Platform fee: {platformFee}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Client Pays</p>
            <p className="text-2xl font-extrabold text-gray-900">
              {currency === "USD" ? "$" : currency} {hourlyRate.toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-400" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Platform Fee</p>
            <p className="text-2xl font-bold text-red-500">
              - {currency === "USD" ? "$" : currency} {feeAmount.toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl border border-green-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-16 h-16 bg-green-100/50 rounded-full -mr-8 -mt-8" />
             <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">You Earn</p>
             <p className="text-3xl font-extrabold text-green-700">
              {currency === "USD" ? "$" : currency} {yourEarnings.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gray-900 text-white hover:bg-black h-12 px-8 rounded-xl font-bold shadow-lg shadow-gray-900/10"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
