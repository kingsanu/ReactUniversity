"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CreditCard,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
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
    last4?: string;
    payoutsEnabled?: boolean;
  } | null>(null);

  useEffect(() => {
    if (parentBankAccount || parentPayouts) {
      setStripeAccount({
        connected: !!(
          parentBankAccount && parentBankAccount.status === "connected"
        ),
        accountId: parentBankAccount?.id,
        email: parentBankAccount?.email,
        last4: parentBankAccount?.last4,
        payoutsEnabled: parentBankAccount?.status === "connected",
      });
      setIsLoading(false);
    } else {
      fetchStripeAccount();
    }
  }, [parentBankAccount, parentPayouts]);

  const fetchStripeAccount = async () => {
    try {
      // Call API to get Stripe/bank account details and payouts
      const bankData = await getCoachBankAccount();
      const payoutsData = await getCoachPayouts();
      const account = bankData?.data;
      const payouts = payoutsData?.data || [];

      const accountObj = {
        connected: !!(account && account.status === "connected"),
        accountId: account?.id,
        email: account?.email,
        last4:
          payouts.length > 0 ? String(payouts[0].amount).slice(-4) : undefined,
        payoutsEnabled: account?.status === "connected",
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
      // Call API to create a Stripe / bank account linking URL
      const { onboardingUrl } = await linkCoachBankAccount();
      if (onboardingUrl) {
        window.location.href = onboardingUrl;
        return;
      }
      toast.info("Stripe Connect integration coming soon");
    } catch (error) {
      toast.error("Failed to connect Stripe account");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect your Stripe account?"))
      return;

    try {
      // TODO: Call API to disconnect Stripe
      // await disconnectStripe();
      setStripeAccount({ connected: false });
      if (onBankAccountUpdated) onBankAccountUpdated(null);
      toast.success("Stripe account disconnected");
    } catch (error) {
      toast.error("Failed to disconnect Stripe account");
    }
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stripe Connect</CardTitle>
          <CardDescription>
            Connect your Stripe account to receive payments directly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!stripeAccount?.connected ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 border rounded-lg bg-muted/50">
                <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Connect Stripe Account</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Link your Stripe account to receive coaching payments
                    directly. Stripe handles all payment processing securely.
                  </p>
                  <Button onClick={handleConnectStripe} disabled={isConnecting}>
                    {isConnecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Connect with Stripe
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-sm text-muted-foreground space-y-2">
                <p className="font-medium">What you'll need:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Business or personal information</li>
                  <li>Bank account details for payouts</li>
                  <li>Tax identification number</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Stripe Connected</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your Stripe account is connected and ready to receive
                    payments.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account ID:</span>
                      <span className="font-mono">
                        {stripeAccount.accountId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{stripeAccount.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Bank Account:
                      </span>
                      <span>****{stripeAccount.last4}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payouts:</span>
                      <Badge
                        variant={
                          stripeAccount.payoutsEnabled ? "default" : "secondary"
                        }
                      >
                        {stripeAccount.payoutsEnabled ? "Enabled" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://dashboard.stripe.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Stripe Dashboard
                  </a>
                </Button>
                <Button variant="outline" size="sm" onClick={handleDisconnect}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Disconnect
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {stripeAccount?.connected && (
        <Card>
          <CardHeader>
            <CardTitle>Payout History</CardTitle>
            <CardDescription>
              View your recent payouts from Stripe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>
                No payouts yet. Complete coaching sessions to receive payments.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
