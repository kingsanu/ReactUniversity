"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Download, FileText } from "lucide-react";
import { toast } from "sonner";

interface BillingSettingsTabProps {
  billingCurrent?: any | null;
  billingHistory?: any[] | null;
  isLoading?: boolean;
}

export function BillingSettingsTab({
  billingCurrent,
  billingHistory: billingHistoryProp,
  isLoading: parentLoading,
}: BillingSettingsTabProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPeriod, setCurrentPeriod] = useState<any>(null);
  const [billingHistory, setBillingHistory] = useState<any[]>([]);

  useEffect(() => {
    if (billingCurrent || billingHistoryProp) {
      setCurrentPeriod(billingCurrent || null);
      setBillingHistory(billingHistoryProp || []);
      setIsLoading(false);
      return;
    }
    fetchBillingData();
  }, [billingCurrent, billingHistoryProp]);

  const fetchBillingData = async () => {
    try {
      // TODO: Call APIs to get billing data
      // const current = await getCurrentBillingPeriod();
      // const history = await getBillingHistory();
      // setCurrentPeriod(current);
      // setBillingHistory(history);
      setCurrentPeriod({
        period: "Nov 1 - Nov 30, 2024",
        totalBookings: 24,
        totalRevenue: 2400.0,
        platformFeeAmount: 360.0,
        status: "pending",
        dueDate: "Dec 5, 2024",
      });
      setBillingHistory([]);
      setIsLoading(false);
    } catch (error) {
      toast.error("Failed to load billing data");
      setIsLoading(false);
    }
  };

  const downloadInvoice = async (billingId: string) => {
    try {
      // TODO: Call API to download invoice
      toast.info("Invoice download coming soon");
    } catch (error) {
      toast.error("Failed to download invoice");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "overdue":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  if (parentLoading || isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (

    <div className="p-6 sm:p-10 space-y-8">
      <div>
         <h2 className="text-xl font-bold text-gray-900">Billing & Invoices</h2>
         <p className="text-gray-500 font-medium mt-1">
           Track platform fees and download invoices.
         </p>
      </div>

      {/* Current Billing Period */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
             <div>
                <h3 className="text-lg font-bold text-gray-900">Current Period</h3>
                <p className="text-sm text-gray-500 font-medium">{currentPeriod?.period}</p>
             </div>
             <Badge className={`${getStatusColor(currentPeriod?.status)} px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg`}>
                {currentPeriod?.status}
             </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Bookings</p>
                <p className="text-2xl font-extrabold text-gray-900">
                  {currentPeriod?.totalBookings}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
                <p className="text-2xl font-extrabold text-gray-900">
                  ${currentPeriod?.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Platform Fee (15%)</p>
                <p className="text-2xl font-extrabold text-red-600">
                  ${currentPeriod?.platformFeeAmount.toFixed(2)}
                </p>
              </div>
              
              <div className="flex flex-col justify-center gap-2">
                 <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Payment Due</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">{currentPeriod?.dueDate}</p>
                 </div>
                 <Button variant="outline" size="sm" className="w-full justify-center mt-2 border-gray-200 hover:bg-gray-50 hover:text-gray-900 font-semibold">
                    <FileText className="mr-2 h-4 w-4" />
                    Invoice
                 </Button>
              </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-medium">
                <strong>Note:</strong> Platform fees are calculated based on completed coaching sessions. You'll receive an invoice at the end of each billing period.
              </p>
          </div>
      </div>

      {/* Billing History */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Billing History</h3>
        {billingHistory.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
             <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6 text-gray-400" />
             </div>
             <p className="text-gray-900 font-semibold">No billing history available</p>
             <p className="text-gray-500 text-sm mt-1">Past invoices will appear here once generated.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="hover:bg-gray-50 border-gray-200">
                  <TableHead className="font-bold text-gray-500">Period</TableHead>
                  <TableHead className="font-bold text-gray-500">Bookings</TableHead>
                  <TableHead className="font-bold text-gray-500">Revenue</TableHead>
                  <TableHead className="font-bold text-gray-500">Fee</TableHead>
                  <TableHead className="font-bold text-gray-500">Status</TableHead>
                  <TableHead className="font-bold text-gray-500 text-right">Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingHistory.map((bill) => (
                  <TableRow key={bill.id} className="hover:bg-blue-50/30 border-gray-100 transition-colors">
                    <TableCell className="font-medium text-gray-900">{bill.period}</TableCell>
                    <TableCell className="text-gray-600">{bill.totalBookings}</TableCell>
                    <TableCell className="font-semibold text-gray-900">${bill.totalRevenue.toFixed(2)}</TableCell>
                    <TableCell className="font-semibold text-red-600">
                      ${bill.platformFeeAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getStatusColor(bill.status)} font-bold tracking-wide`}
                        variant="secondary"
                      >
                        {bill.status.charAt(0).toUpperCase() +
                          bill.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadInvoice(bill.id)}
                        className="hover:bg-gray-100 rounded-lg h-8 w-8 p-0"
                      >
                        <Download className="h-4 w-4 text-gray-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
