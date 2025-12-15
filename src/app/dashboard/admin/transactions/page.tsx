"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAccess } from "@/hooks/useAdminAccess";
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
import {
  getAdminTransactions,
  AdminTransaction,
} from "@/services/adminService";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminTransactionsPage() {
  const router = useRouter();
  const { isAdmin, loading: authLoading } = useAdminAccess();

  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Handle admin access check
  useEffect(() => {
    if (!authLoading) {
      if (!isAdmin) {
        toast.error("Access denied. This area is for administrators only.");
        router.push("/dashboard");
        return;
      }
      fetchTransactions();
    }
  }, [isAdmin, authLoading, router, page, statusFilter]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!authLoading && isAdmin) {
        setPage(1); // Reset to page 1 on search
        fetchTransactions();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await getAdminTransactions({
        page,
        limit: 20,
        search: searchTerm,
        status: statusFilter,
      });
      setTransactions(response.items);
      setTotalPages(Math.ceil(response.total / response.limit));
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying admin access...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Monitor all system transactions and payments
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        <div className="border rounded-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
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
                    No transactions found.
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
                          ID: {trx.userId}
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
                        {trx.status}
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
