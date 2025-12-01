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
    <Card>
      <CardHeader>
        <CardTitle>Pricing Settings</CardTitle>
        <CardDescription>
          Set your hourly rate and currency for coaching sessions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value="USD" disabled>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate">Hourly Rate</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="rate"
                type="number"
                min="0"
                step="0.01"
                className="pl-9"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Set your rate per hour session.
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/50 p-4">
          <div className="flex items-start gap-2 mb-4">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Earnings Breakdown</p>
              <p className="text-muted-foreground">
                Platform fee: {platformFee}%
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white rounded border">
              <p className="text-xs text-muted-foreground mb-1">Client Pays</p>
              <p className="font-semibold text-gray-900">
                {currency === "USD" ? "$" : currency} {hourlyRate.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-white rounded border">
              <p className="text-xs text-muted-foreground mb-1">Platform Fee</p>
              <p className="font-semibold text-red-600">
                - {currency === "USD" ? "$" : currency} {feeAmount.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded border border-green-100">
              <p className="text-xs text-green-700 mb-1">You Earn</p>
              <p className="font-bold text-green-700">
                {currency === "USD" ? "$" : currency} {yourEarnings.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t pt-6">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-black text-white hover:bg-gray-800"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
