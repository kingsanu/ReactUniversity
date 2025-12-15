"use client";

import React, { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Download,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  MoreHorizontal,
  CreditCard,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  getUserTransactions,
  Transaction,
} from "@/services/transactionService";
import { toast } from "sonner";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await getUserTransactions({ page: 1, limit: 50 });
      setTransactions(response.items);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(
    (trx) =>
      trx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trx.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      toast.error("No transactions to export");
      return;
    }

    const headers = ["ID", "Date", "Description", "Amount", "Status", "Method"];
    const csvContent = [
      headers.join(","),
      ...transactions.map((trx) =>
        [
          trx.id,
          new Date(trx.date).toLocaleDateString(),
          `"${trx.description}"`,
          trx.amount,
          trx.status,
          trx.method || "N/A",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "transactions.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleManageMethods = () => {
    toast.info("Payment methods management coming soon!");
  };

  // Calculate stats
  const totalSpent = transactions
    .filter((t) => t.status === "completed")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const invoiceCount = transactions.filter(
    (t) => t.status === "completed"
  ).length;

  const activeMethod =
    transactions.length > 0 ? transactions[0].method : "No active method";

  return (
    <div className="space-y-8 p-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Transactions
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Manage your payments, invoices, and billing history.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="h-10 gap-2 rounded-xl"
            onClick={handleExportCSV}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button
            className="h-10 gap-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-900/20"
            onClick={handleManageMethods}
          >
            <CreditCard className="w-4 h-4" />
            Manage Methods
          </Button>
        </div>
      </div>

      {/* Stats Cards (Optional but adds aesthetic value) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ArrowUpRight className="w-24 h-24" />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Total Spent</p>
          <h3 className="text-3xl font-bold text-gray-900">
            $
            {totalSpent.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h3>
          <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
            <span className="bg-green-100 px-1.5 py-0.5 rounded-md">
              Lifetime
            </span>{" "}
            total
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Receipt className="w-24 h-24" />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Invoices</p>
          <h3 className="text-3xl font-bold text-gray-900">{invoiceCount}</h3>
          <p className="text-xs text-gray-500 font-medium mt-2">
            Available for download
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <CreditCard className="w-24 h-24" />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">
            Last Used Method
          </p>
          <h3 className="text-xl font-bold text-gray-900 truncate">
            {activeMethod || "N/A"}
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-2">
            From recent transaction
          </p>
        </div>
      </div>

      {/* Filters and Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              className="pl-9 bg-white border-gray-200 rounded-xl focus-visible:ring-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2 rounded-lg border-gray-200 text-gray-600"
            >
              <Filter className="w-3.5 h-3.5" />
              Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2 rounded-lg border-gray-200 text-gray-600"
            >
              <Calendar className="w-3.5 h-3.5" />
              Date
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="hover:bg-transparent border-gray-100">
                <TableHead className="w-[150px] pl-6">Transaction ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((trx) => (
                <TableRow
                  key={trx.id}
                  className="group hover:bg-gray-50/50 border-gray-100 transition-colors"
                >
                  <TableCell className="font-medium pl-6 text-gray-900">
                    {trx.id}
                  </TableCell>
                  <TableCell className="text-gray-600 font-medium">
                    {trx.description}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(trx.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
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
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "font-medium rounded-lg px-2 py-0.5",
                        trx.status === "completed" &&
                          "bg-green-50 text-green-700 hover:bg-green-100",
                        trx.status === "pending" &&
                          "bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
                        trx.status === "failed" &&
                          "bg-red-50 text-red-700 hover:bg-red-100"
                      )}
                    >
                      {trx.status.charAt(0).toUpperCase() + trx.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-gray-900 pr-6">
                    {trx.currency === "USD" ? "$" : trx.currency}
                    {trx.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Download Invoice</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Report Issue
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Empty State check would go here */}
        {filteredTransactions.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-medium">No transactions found</h3>
            <p className="text-gray-500 text-sm mt-1">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
