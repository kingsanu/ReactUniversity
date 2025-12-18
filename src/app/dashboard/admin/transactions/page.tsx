"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { useAdminTransactions } from "@/hooks/useAdminTransactions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, Download, CreditCard, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

export default function AdminTransactionsPage() {
  const router = useRouter();
  const { isAdmin, loading: authLoading } = useAdminAccess();
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Use the new hook for data fetching
  const { 
    data, 
    isLoading: transactionsLoading, 
    error 
  } = useAdminTransactions({
    page,
    limit: 20,
    search: searchTerm,
    status: statusFilter,
  });

  const transactions = data?.items || [];
  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;
  const loading = transactionsLoading;

  // Handle admin access check
  useEffect(() => {
    if (!authLoading) {
      if (!isAdmin) {
        toast.error(t("admin.accessDenied"));
        router.push("/dashboard");
      }
    }
  }, [isAdmin, authLoading, router]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!authLoading && isAdmin) {
        setPage(1); // Reset to page 1 on search
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (authLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">{t("admin.verifying")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("admin.transactions.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("admin.transactions.subtitle")}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("admin.transactions.searchPlaceholder")}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue
                  placeholder={t("admin.transactions.statusPlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("admin.transactions.status.all")}
                </SelectItem>
                <SelectItem value="completed">
                  {t("admin.transactions.status.completed")}
                </SelectItem>
                <SelectItem value="pending">
                  {t("admin.transactions.status.pending")}
                </SelectItem>
                <SelectItem value="failed">
                  {t("admin.transactions.status.failed")}
                </SelectItem>
                <SelectItem value="refunded">
                  {t("admin.transactions.status.refunded")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            {t("admin.transactions.exportReport")}
          </Button>
        </div>

        <div className="border rounded-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.transactions.table.id")}</TableHead>
                <TableHead>{t("admin.transactions.table.user")}</TableHead>
                <TableHead>
                  {t("admin.transactions.table.description")}
                </TableHead>
                <TableHead>{t("admin.transactions.table.amount")}</TableHead>
                <TableHead>{t("admin.transactions.table.status")}</TableHead>
                <TableHead>{t("admin.transactions.table.date")}</TableHead>
                <TableHead>{t("admin.transactions.table.method")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-10 text-gray-500"
                  >
                    {t("admin.transactions.noTransactions")}
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((trx) => (
                  <TableRow key={trx.id}>
                    <TableCell className="font-medium text-xs">
                      {trx.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{trx.userName}</span>
                        <span className="text-xs text-gray-500">
                          {t("admin.transactions.userId", { id: trx.userId })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{trx.description}</TableCell>
                    <TableCell className="font-bold">
                      {trx.currency} {trx.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          trx.status === "completed"
                            ? "default"
                            : trx.status === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                        className={
                          trx.status === "completed"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : trx.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            : ""
                        }
                      >
                        {t(`admin.transactions.status.${trx.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(trx.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-gray-500 flex items-center gap-2">
                      {trx.method &&
                      (trx.method.includes("Visa") ||
                        trx.method.includes("Mastercard")) ? (
                        <CreditCard className="w-3 h-3" />
                      ) : (
                        <Receipt className="w-3 h-3" />
                      )}
                      {trx.method || "N/A"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            Previous
          </Button>
          <div className="text-sm text-gray-500">
            Page {page} of {totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
