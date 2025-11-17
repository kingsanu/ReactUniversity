"use client";

import React from "react";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { AdminLayout } from "@/app/dashboard/admin/_components/AdminLayout";
import { CareerManager } from "./_components/CareerManager";

export default function AdminCareersPage() {
  const { isAdmin, loading } = useAdminAccess();

  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return <div>Access denied</div>;

  return (
    <AdminLayout>
      <CareerManager />
    </AdminLayout>
  );
}
