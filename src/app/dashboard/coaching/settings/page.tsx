"use client";

import { useState, useEffect } from "react";
import {
  getCoachDetails,
  getAvailability,
  getCoachBankAccount,
  getCoachPayouts,
} from "@/services/coachService";
import { useGlobalStore } from "@/store/useGlobalStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { DollarSign, Calendar, CreditCard, FileText } from "lucide-react";
import { PricingSettingsTab } from "./_components/PricingSettingsTab";
import { AvailabilitySettingsTab } from "./_components/AvailabilitySettingsTab";
import { PaymentSettingsTab } from "./_components/PaymentSettingsTab";
import { BillingSettingsTab } from "./_components/BillingSettingsTab";

export default function CoachSettingsPage() {
  const [activeTab, setActiveTab] = useState("pricing");
  const [coachDetails, setCoachDetails] = useState<any | null>(null);
  const [availability, setAvailability] = useState<any | null>(null);
  const [bankAccount, setBankAccount] = useState<any | null>(null);
  const [payouts, setPayouts] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useGlobalStore();

  useEffect(() => {
    const preloadSettings = async () => {
      try {
        setIsLoading(true);
        if (!user?.id) return;
        const [detailsRes, availabilityRes, bankRes, payoutsRes] =
          await Promise.all([
            getCoachDetails(user.id),
            getAvailability(),
            getCoachBankAccount(),
            getCoachPayouts(),
          ]);

        // Service response shapes vary: some return the raw object, others return { data: object }
        // Normalize results into the simplest usable form for the UI.
        setCoachDetails((detailsRes as any) || null);
        setAvailability((availabilityRes as any) || null);
        setBankAccount((bankRes as any)?.data || (bankRes as any) || null);
        setPayouts((payoutsRes as any)?.data || (payoutsRes as any) || []);
      } catch (e) {
        console.error("Failed to preload settings data:", e);
      } finally {
        setIsLoading(false);
      }
    };
    // only preload once user is set
    if (user?.id) preloadSettings();
  }, []);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your coaching profile, pricing, availability, and payments.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Pricing</span>
          </TabsTrigger>
          <TabsTrigger value="availability" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Availability</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Payments</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pricing">
          <PricingSettingsTab
            coachDetails={coachDetails}
            isLoading={isLoading}
            onUpdated={(newData: any) =>
              setCoachDetails((prev: any) => ({ ...prev, ...(newData || {}) }))
            }
          />
        </TabsContent>

        <TabsContent value="availability">
          <AvailabilitySettingsTab
            availability={availability}
            isLoading={isLoading}
            onUpdated={(newData: any) =>
              setAvailability((prev: any) => ({ ...prev, ...(newData || {}) }))
            }
          />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentSettingsTab
            bankAccount={bankAccount}
            payouts={payouts}
            isLoading={isLoading}
            onBankAccountUpdated={(bank: any) => setBankAccount(bank)}
            onPayoutsUpdated={(p) => setPayouts(p)}
          />
        </TabsContent>

        <TabsContent value="billing">
          <BillingSettingsTab
            billingCurrent={null}
            billingHistory={null}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
