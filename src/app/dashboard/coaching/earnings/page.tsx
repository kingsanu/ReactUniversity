"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRight,
  Download,
  Filter,
} from "lucide-react";
import {
  getCoachEarnings,
  getCoachEarningsHistory,
  CoachEarningsStats,
  EarningsHistoryItem,
} from "@/services/coachService";
import { toast } from "sonner";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

export default function EarningsPage() {
  const { t } = useTranslation();
  const [earningsStats, setEarningsStats] = useState<CoachEarningsStats | null>(
    null
  );
  const [earningsHistory, setEarningsHistory] = useState<EarningsHistoryItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const fetchEarningsData = async () => {
    try {
      const [statsResponse, historyResponse] = await Promise.all([
        getCoachEarnings(),
        getCoachEarningsHistory(),
      ]);
      setEarningsStats(statsResponse);
      setEarningsHistory(historyResponse);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch earnings data:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load earnings data";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNet = (gross: number) => {
    // Assuming 20% commission rate, this should come from API
    return gross * 0.8;
  };

  const calculateFee = (gross: number) => {
    return gross * 0.2;
  };

  if (isLoading) {
    return (
      <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-gray-200 rounded-2xl"></div>
            <div className="h-32 bg-gray-200 rounded-2xl"></div>
            <div className="h-32 bg-gray-200 rounded-2xl"></div>
          </div>
          <div className="h-96 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Error loading earnings data
          </h1>
          <p className="text-gray-500 mt-2">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!earningsStats) {
    return (
      <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Unable to load earnings data
          </h1>
          <p className="text-gray-500 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {t("coaching.earnings.title")}
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            {t("coaching.earnings.subtitle")}
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white border-0 shadow-lg shadow-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-100 uppercase tracking-wider">
              Total Earnings (Net)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">
                ${earningsStats?.totalEarnings?.toLocaleString() || "0"}
              </span>
            </div>
            <p className="text-blue-100 text-sm mt-1 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Pending Payout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900">
                ${earningsStats?.pendingPayout?.toLocaleString() || "0"}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Next payout: Apr 1st
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Last Payout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900">
                ${earningsStats?.lastPayoutAmount?.toLocaleString() || "0"}
              </span>
            </div>
            <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
              Paid on {earningsStats?.lastPayoutDate || "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown Section */}
      <Card className="overflow-hidden border-gray-100 shadow-sm">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                Detailed breakdown of your sessions and fees.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-2">
                <Filter className="w-3.5 h-3.5" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Gross Amount</TableHead>
                <TableHead className="text-right text-red-500">
                  Platform Fee (20%)
                </TableHead>
                <TableHead className="text-right font-bold text-emerald-600">
                  Net Earning
                </TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {earningsHistory?.map((item, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="font-medium text-gray-900">
                    {item.date}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {item.description}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${item.amountGross?.toFixed(2) || "0.00"}
                  </TableCell>
                  <TableCell className="text-right text-red-500">
                    -${calculateFee(item.amountGross || 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-emerald-600">
                    ${calculateNet(item.amountGross || 0).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        item.status === "completed"
                          ? "bg-green-50 text-green-700"
                          : item.status === "pending"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-red-50 text-red-700"
                      }
                    >
                      {item.status === "completed"
                        ? "Paid"
                        : item.status === "pending"
                        ? "Pending"
                        : "Cancelled"}
                    </Badge>
                  </TableCell>
                </TableRow>
              )) || []}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
