"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, CheckCircle, ExternalLink } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getCoachBankAccount,
  getCoachPayouts,
  linkCoachBankAccount,
} from "@/services/coachService";
import { toast } from "sonner";

interface PaymentSettingsTabProps {
  bankAccount?: any | null;
  payouts?: any[] | null;
  isLoading?: boolean;
  onBankAccountUpdated?: (bank: any | null) => void;
  onPayoutsUpdated?: (payouts: any[]) => void;
}

export function PaymentSettingsTab({
  bankAccount: parentBankAccount,
  payouts: parentPayouts,
  isLoading: parentLoading,
  onBankAccountUpdated,
  onPayoutsUpdated,
}: PaymentSettingsTabProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [stripeAccount, setStripeAccount] = useState<{
    connected: boolean;
    accountId?: string;
    email?: string;
    last4?: string | null;
    payoutsEnabled?: boolean;
    onboardingLink?: string;
    requiresOnboarding?: boolean;
  } | null>(null);
  const [payoutFrequency, setPayoutFrequency] = useState("monthly");

  useEffect(() => {
    if (parentBankAccount || parentPayouts) {
      setStripeAccount({
        connected: !!(
          parentBankAccount &&
          (parentBankAccount.status === "connected" ||
            parentBankAccount.isConnected)
        ),
        accountId: parentBankAccount?.id,
        email: parentBankAccount?.email,
        last4: parentBankAccount?.last4,
        payoutsEnabled:
          parentBankAccount?.status === "connected" ||
          parentBankAccount?.isConnected,
        onboardingLink: parentBankAccount?.onboardingLink,
        requiresOnboarding: parentBankAccount?.requiresOnboarding,
      });
      setIsLoading(false);
    } else {
      fetchStripeAccount();
    }
  }, [parentBankAccount, parentPayouts]);

  const fetchStripeAccount = async () => {
    try {
      const bankData = await getCoachBankAccount();
      const payoutsData = await getCoachPayouts();
      const account = bankData?.data;
      const payouts = payoutsData?.data || [];

      const accountObj = {
        connected: account?.isConnected || false,
        accountId: account?.id,
        email: account?.email,
        last4: account?.last4,
        payoutsEnabled: account?.isConnected || false,
        onboardingLink: account?.onboardingLink, // Store onboarding link
        requiresOnboarding: account?.requiresOnboarding,
      };
      setStripeAccount(accountObj);
      if (onBankAccountUpdated) onBankAccountUpdated(accountObj);
      if (onPayoutsUpdated) onPayoutsUpdated(payouts);
      setIsLoading(false);
    } catch (error) {
      toast.error("Failed to load payment settings");
      setIsLoading(false);
    }
  };

  const handleConnectStripe = async () => {
    setIsConnecting(true);
    try {
      // Check if we already have an onboarding link from GET request
      if (stripeAccount?.onboardingLink) {
        // Redirect directly to the onboarding link
        window.location.href = stripeAccount.onboardingLink;
        return;
      }

      // Otherwise, call POST endpoint to generate link
      const response = await linkCoachBankAccount({
        provider: "stripe",
        accountType: "checking",
        accountHolderName: "", // Will be filled during Stripe onboarding
        bankName: "", // Will be filled during Stripe onboarding
      });

      if (response.onboardingUrl) {
        // Redirect to Stripe Connect onboarding
        window.location.href = response.onboardingUrl;
        return;
      }

      toast.success(response.message || "Bank account linked successfully");
      fetchStripeAccount(); // Refresh account status
    } catch (error: any) {
      console.error("Stripe connection error:", error);
      toast.error(error.message || "Failed to connect Stripe account");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect your Stripe account?"))
      return;

    try {
      setStripeAccount({ connected: false });
      if (onBankAccountUpdated) onBankAccountUpdated(null);
      toast.success("Stripe account disconnected");
    } catch (error) {
      toast.error("Failed to disconnect Stripe account");
    }
  };

  const handleFrequencyChange = async (value: string) => {
    // In a real app, call API to update frequency here
    setPayoutFrequency(value);
    toast.success(`Payout frequency updated to ${value}`);
  };

  if (parentLoading || isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-6 sm:p-10 space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Payments & Payouts</h2>
        <p className="text-gray-500 font-medium mt-1">
          Manage your Stripe connection and view payout history.
        </p>
      </div>

      {!stripeAccount?.connected ? (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-8 flex flex-col items-center text-center space-y-6 shadow-sm">
          <div className="h-16 w-16 bg-white rounded-2xl shadow-md flex items-center justify-center">
            <CreditCard className="h-8 w-8 text-indigo-600" />
          </div>
          <div className="max-w-md space-y-2">
            <h3 className="text-xl font-bold text-gray-900">
              Connect with Stripe
            </h3>
            <p className="text-gray-600">
              Link your Stripe account to receive coaching payments directly.
              Stripe handles all payment processing securely.
            </p>
          </div>

          <Button
            onClick={handleConnectStripe}
            disabled={isConnecting}
            className="bg-[#635BFF] hover:bg-[#544ee6] text-white px-8 py-6 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all hover:scale-105"
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>Connect Stripe Account</>
            )}
          </Button>

          <div className="pt-6 border-t border-indigo-100 w-full max-w-lg">
            <p className="text-sm font-semibold text-gray-500 mb-3">
              WHAT YOU'LL NEED
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center justify-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                Bank Details
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                Tax Information
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                Personal Info
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-full -mr-16 -mt-16" />
            <div className="flex items-start gap-4 relative z-10">
              <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">
                  Stripe Connected
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Your account is ready to receive payouts.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="bg-white p-3 rounded-xl border border-emerald-100/50 shadow-sm">
                    <span className="text-xs font-bold text-gray-400 uppercase">
                      Account Email
                    </span>
                    <p className="font-semibold text-gray-900 truncate">
                      {stripeAccount.email}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-100/50 shadow-sm">
                    <span className="text-xs font-bold text-gray-400 uppercase">
                      Bank Account
                    </span>
                    <p className="font-semibold text-gray-900">
                      ****{stripeAccount.last4}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="bg-white hover:bg-gray-50 border-gray-200"
                  >
                    <a
                      href="https://dashboard.stripe.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Dashboard
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDisconnect}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border-gray-100 rounded-2xl p-6 border shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Payout Preferences
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-medium text-gray-900">Payout Frequency</p>
                <p className="text-sm text-gray-500">
                  Choose how often you want to receive your earnings.
                </p>
              </div>
              <div className="w-full sm:w-[200px]">
                <Select
                  value={payoutFrequency}
                  onValueChange={handleFrequencyChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="biweekly">
                      Bi-weekly (Every 2 weeks)
                    </SelectItem>
                    <SelectItem value="monthly">
                      Monthly (1st of month)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Payout History</h3>
            {!parentPayouts || parentPayouts.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100 border-dashed">
                <p className="text-gray-500 font-medium">
                  No payouts yet. Complete sessions to start earning!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100 border-dashed">
                  <p className="text-gray-500 font-medium">
                    No payout history available.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
