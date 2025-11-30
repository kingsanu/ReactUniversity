"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { DollarSign, Calendar, CreditCard, FileText } from "lucide-react";
import { PricingSettingsTab } from "./_components/PricingSettingsTab";
import { AvailabilitySettingsTab } from "./_components/AvailabilitySettingsTab";
import { PaymentSettingsTab } from "./_components/PaymentSettingsTab";
import { BillingSettingsTab } from "./_components/BillingSettingsTab";

export default function CoachSettingsPage() {
  const [activeTab, setActiveTab] = useState("pricing");

  return (
    <div className="container max-w-4xl mx-auto py-8 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your coaching profile, pricing, availability, and payments.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
          <PricingSettingsTab />
        </TabsContent>

        <TabsContent value="availability">
          <AvailabilitySettingsTab />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentSettingsTab />
        </TabsContent>

        <TabsContent value="billing">
          <BillingSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
