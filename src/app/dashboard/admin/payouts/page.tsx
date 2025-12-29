"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  getAdminPayouts,
  approveAdminPayout,
  rejectAdminPayout,
  AdminPayout,
} from "@/services/adminPayoutService";
import { PayoutStatus } from "@/types/coach";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusBadgeClasses: Record<PayoutStatus, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  failed: "bg-red-50 text-red-700 border-red-200",
};

const formatCurrency = (value?: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value ?? 0);

export default function AdminPayoutsPage() {
  const { t } = useTranslation();
  const [payouts, setPayouts] = useState<AdminPayout[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PayoutStatus>("pending");
  const [isLoading, setIsLoading] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const filteredPayouts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return payouts.filter((p) => {
      if (!term) return true;
      const haystack = `${p.coachName || ""} ${p.coachEmail || ""} ${p.coachId || ""}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [payouts, searchTerm]);

  const totalPending = filteredPayouts.reduce((acc, curr) => {
    const amount = curr.netAmount ?? curr.amount ?? 0;
    return acc + amount;
  }, 0);

  const loadPayouts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAdminPayouts({ status: statusFilter });
      setPayouts(response.items || []);
    } catch (error: any) {
      toast.error(error?.message || "Failed to load payouts");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadPayouts();
  }, [loadPayouts]);

  const handleApprove = async (id: string) => {
    setActioningId(id);
    try {
      await approveAdminPayout(id);
      toast.success(t("admin.payouts.toast.approved", { defaultValue: "Payout approved" }));
      await loadPayouts();
    } catch (error: any) {
      toast.error(error?.message || "Failed to approve payout");
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt(
      t("admin.payouts.prompt.reason", {
        defaultValue: "Enter a reason for rejection",
      })
    );
    if (!reason) return;

    setActioningId(id);
    try {
      await rejectAdminPayout(id, reason);
      toast.success(t("admin.payouts.toast.rejected", { defaultValue: "Payout rejected" }));
      await loadPayouts();
    } catch (error: any) {
      toast.error(error?.message || "Failed to reject payout");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          {t("admin.payouts.title")}
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          {t("admin.payouts.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-900 text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 uppercase">
              {t("admin.payouts.totalPending")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-4xl font-bold">
              {formatCurrency(totalPending)}
            </span>
            <p className="text-gray-400 text-sm mt-1">
              {t("admin.payouts.requestsAwaiting", { count: filteredPayouts.length })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase">
              {t("admin.payouts.processedThisMonth")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-4xl font-bold text-gray-900">—</span>
            <p className="text-green-600 text-sm mt-1 font-medium">
              {t("admin.payouts.allSettlementsCleared")}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t("admin.payouts.searchPlaceholder")}
                className="pl-9 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Select
                value={statusFilter}
                onValueChange={(value: PayoutStatus) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder={t("admin.payouts.filterStatus") ?? "Status"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={loadPayouts} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("admin.payouts.refresh", { defaultValue: "Refresh" })
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("admin.payouts.table.payoutId")}</TableHead>
              <TableHead>{t("admin.payouts.table.coach")}</TableHead>
              <TableHead>{t("admin.payouts.table.period")}</TableHead>
              <TableHead className="text-right">
                {t("admin.payouts.table.amount")}
              </TableHead>
              <TableHead>{t("admin.payouts.table.status")}</TableHead>
              <TableHead className="text-right">
                {t("admin.payouts.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("admin.payouts.loading", { defaultValue: "Loading payouts..." })}
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              filteredPayouts.map((payout) => {
                const payoutId = (payout.id || payout.payoutId || "").toString();
                return (
                  <TableRow key={payoutId || payout.coachId}>
                    <TableCell className="font-medium">{payoutId || "—"}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {payout.coachName || "—"}
                        </p>
                        <p className="text-xs text-gray-500">{payout.coachId}</p>
                        {payout.coachEmail && (
                          <p className="text-xs text-gray-500">{payout.coachEmail}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {payout.periodStart || "—"} {payout.periodEnd ? `- ${payout.periodEnd}` : ""}
                    </TableCell>
                    <TableCell className="text-right font-bold text-gray-900">
                      {formatCurrency(payout.netAmount ?? payout.amount, payout.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusBadgeClasses[payout.status] || ""}
                      >
                        {payout.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          disabled={!payoutId || actioningId === payoutId}
                          onClick={() => payoutId && handleReject(payoutId)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          {t("admin.payouts.actions.reject")}
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={!payoutId || actioningId === payoutId}
                          onClick={() => payoutId && handleApprove(payoutId)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {t("admin.payouts.actions.approve")}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

            {!isLoading && filteredPayouts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                  {t("admin.payouts.noPending")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
