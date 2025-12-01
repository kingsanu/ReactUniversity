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
    <div className="space-y-6">
      {/* Current Billing Period */}
      <Card>
        <CardHeader>
          <CardTitle>Current Billing Period</CardTitle>
          <CardDescription>
            Platform fees for {currentPeriod?.period}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">
                  {currentPeriod?.totalBookings}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ${currentPeriod?.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Platform Fee (15%)
                </p>
                <p className="text-2xl font-bold text-red-600">
                  ${currentPeriod?.platformFeeAmount.toFixed(2)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  className={getStatusColor(currentPeriod?.status)}
                  variant="secondary"
                >
                  {currentPeriod?.status.charAt(0).toUpperCase() +
                    currentPeriod?.status.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Payment Due</p>
                  <p className="text-sm text-muted-foreground">
                    Due by {currentPeriod?.dueDate}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  View Invoice
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                <strong>Note:</strong> Platform fees are calculated based on
                completed coaching sessions. You'll receive an invoice at the
                end of each billing period.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            View past billing periods and invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {billingHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No billing history yet.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Platform Fee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Invoice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingHistory.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell>{bill.period}</TableCell>
                      <TableCell>{bill.totalBookings}</TableCell>
                      <TableCell>${bill.totalRevenue.toFixed(2)}</TableCell>
                      <TableCell className="text-red-600">
                        ${bill.platformFeeAmount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusColor(bill.status)}
                          variant="secondary"
                        >
                          {bill.status.charAt(0).toUpperCase() +
                            bill.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadInvoice(bill.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
