"use client";
import { useState } from 'react';
import { Sidebar } from '../_components/Sidebar';
import { TopNav } from '../_components/TopNav';
import { SubscriptionPlans } from './_components/SubscriptionPlans';

export default function SubscriptionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <TopNav onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Subscriptions</h1>
            <p className="text-gray-600 text-sm md:text-base">Choose the perfect plan for your career journey</p>
          </div>

          {/* Subscription Plans */}
          <SubscriptionPlans />
        </main>
      </div>
    </div>
  );
}
