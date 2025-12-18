"use client";

import { useState } from "react";
import { SingleInviteForm } from "@/components/admin/SingleInviteForm";
import { BulkInviteForm } from "@/components/admin/BulkInviteForm";
import { CoachesTable } from "@/components/admin/CoachesTable";
import { Button } from "@/components/ui/button";
import { Plus, Users, UserCheck, UserPlus, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CoachesPage() {
  const { t } = useTranslation();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  // Mock stats - in a real app these would come from an API
  const stats = [
    {
      labelKey: "admin.coaches.totalCoaches",
      label: "Total Coaches",
      value: "24",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50/50",
      border: "border-blue-100",
    },
    {
      labelKey: "admin.coaches.activeNow",
      label: "Active Now",
      value: "18",
      icon: UserCheck,
      color: "text-green-600",
      bg: "bg-green-50/50",
      border: "border-green-100",
    },
    {
      labelKey: "admin.coaches.pendingInvites",
      label: "Pending Invites",
      value: "4",
      icon: UserPlus,
      color: "text-orange-600",
      bg: "bg-orange-50/50",
      border: "border-orange-100",
    },
    {
      labelKey: "admin.coaches.expiringContracts",
      label: "Expiring Contracts",
      value: "2",
      icon: Clock,
      color: "text-red-600",
      bg: "bg-red-50/50",
      border: "border-red-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 space-y-10 font-sans">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {t("admin.coaches.title")}
            </h1>
            <p className="text-lg text-gray-500 font-medium">
              {t("admin.coaches.subtitle")}
            </p>
          </div>

          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gray-900 text-white hover:bg-black shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full px-6 h-12 text-sm font-semibold tracking-wide">
                <Plus className="mr-2 h-4 w-4" />
                {t("admin.coaches.inviteButton")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl rounded-2xl p-0 overflow-hidden gap-0">
              <DialogHeader className="p-6 bg-gray-50/50 border-b border-gray-100">
                <DialogTitle className="text-xl">
                  {t("admin.coaches.inviteTitle")}
                </DialogTitle>
                <DialogDescription className="text-base pt-1">
                  {t("admin.coaches.inviteDescription")}
                </DialogDescription>
              </DialogHeader>
              <div className="p-6">
                <Tabs defaultValue="single" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100/50 p-1 rounded-xl">
                    <TabsTrigger
                      value="single"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      {t("admin.coaches.singleInvite")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="bulk"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      {t("admin.coaches.bulkUpload")}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="single" className="mt-0">
                    <SingleInviteForm />
                  </TabsContent>
                  <TabsContent value="bulk" className="mt-0">
                    <BulkInviteForm />
                  </TabsContent>
                </Tabs>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Bento Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-2xl border ${stat.border} bg-white p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
            >
              <div
                className={`absolute right-0 top-0 h-24 w-24 translate-x-8 translate-y--8 rounded-full ${stat.bg} opacity-20 blur-2xl transition-transform duration-500 group-hover:scale-150`}
              />
              <div className="relative flex flex-col gap-4">
                <div
                  className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}
                >
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-gray-500 mt-1">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto">
        <CoachesTable />
      </div>
    </div>
  );
}
