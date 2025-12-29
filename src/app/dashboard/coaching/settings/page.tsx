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
import { cn } from "@/lib/utils";
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

        const payoutItems =
          (payoutsRes as any)?.items ||
          (payoutsRes as any)?.data ||
          (payoutsRes as any) ||
          [];
        setPayouts(Array.isArray(payoutItems) ? payoutItems : []);
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
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container max-w-5xl mx-auto py-12 px-4 sm:px-6 relative z-10">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Settings</h1>
          <p className="text-lg text-gray-500 font-medium">
            Manage your coaching profile, pricing, availability, and payments.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <div className="bg-white/60 backdrop-blur-xl p-1.5 rounded-2xl shadow-sm border border-white/50 inline-flex">
            <TabsList className="bg-transparent h-auto p-0 gap-1">
              <TabsTrigger 
                value="pricing" 
                className="rounded-xl px-5 py-2.5 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-semibold text-gray-600 hover:text-gray-900 transition-all flex items-center gap-2"
              >
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Pricing</span>
              </TabsTrigger>
              <TabsTrigger 
                value="availability" 
                className="rounded-xl px-5 py-2.5 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-semibold text-gray-600 hover:text-gray-900 transition-all flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Availability</span>
              </TabsTrigger>
              <TabsTrigger 
                value="payments" 
                className="rounded-xl px-5 py-2.5 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-semibold text-gray-600 hover:text-gray-900 transition-all flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Payments</span>
              </TabsTrigger>
              <TabsTrigger 
                value="billing" 
                className="rounded-xl px-5 py-2.5 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-semibold text-gray-600 hover:text-gray-900 transition-all flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Billing</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-xl overflow-hidden min-h-[400px] p-1">
            <TabsContent value="pricing" className="m-0 focus-visible:ring-0 focus-visible:outline-none">
              <PricingSettingsTab
                coachDetails={coachDetails}
                isLoading={isLoading}
                onUpdated={(newData: any) =>
                  setCoachDetails((prev: any) => ({ ...prev, ...(newData || {}) }))
                }
              />
            </TabsContent>

            <TabsContent value="availability" className="m-0 focus-visible:ring-0 focus-visible:outline-none">
              <AvailabilitySettingsTab
                availability={availability}
                isLoading={isLoading}
                onUpdated={(newData: any) =>
                  setAvailability((prev: any) => ({ ...prev, ...(newData || {}) }))
                }
              />
            </TabsContent>

            <TabsContent value="payments" className="m-0 focus-visible:ring-0 focus-visible:outline-none">
              <PaymentSettingsTab
                bankAccount={bankAccount}
                payouts={payouts}
                isLoading={isLoading}
                onBankAccountUpdated={(bank: any) => setBankAccount(bank)}
                onPayoutsUpdated={(p) => setPayouts(p)}
              />
            </TabsContent>

            <TabsContent value="billing" className="m-0 focus-visible:ring-0 focus-visible:outline-none">
              <BillingSettingsTab
                billingCurrent={null}
                billingHistory={null}
                isLoading={isLoading}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
