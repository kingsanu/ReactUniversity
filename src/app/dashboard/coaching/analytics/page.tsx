"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Activity,
  Wallet,
  Clock,
  Download,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGlobalStore } from "@/store/useGlobalStore";
import {
  getCoachAnalytics,
  getCoachAnalyticsReport,
} from "@/services/coachService";
import { toast } from "sonner";

// Mock Data Sets
const DATA_SETS: Record<string, any[]> = {
  "7d": [
    { name: "Mon", amount: 150 },
    { name: "Tue", amount: 230 },
    { name: "Wed", amount: 180 },
    { name: "Thu", amount: 290 },
    { name: "Fri", amount: 320 },
    { name: "Sat", amount: 400 },
    { name: "Sun", amount: 200 },
  ],
  "30d": [
    { name: "Week 1", amount: 1200 },
    { name: "Week 2", amount: 1900 },
    { name: "Week 3", amount: 1500 },
    { name: "Week 4", amount: 2100 },
  ],
  "3m": [
    { name: "Month 1", amount: 5200 },
    { name: "Month 2", amount: 6100 },
    { name: "Month 3", amount: 5800 },
  ],
  ytd: [
    { name: "Jan", amount: 4200 },
    { name: "Feb", amount: 4900 },
    { name: "Mar", amount: 5500 },
    { name: "Apr", amount: 5100 },
    { name: "May", amount: 6800 },
    { name: "Jun", amount: 6400 },
  ],
};

const MOCK_SESSION_DISTRIBUTION = [
  { name: "Career Planning", value: 45, color: "#3B82F6" },
  { name: "Resume Review", value: 30, color: "#10B981" },
  { name: "Interview Prep", value: 25, color: "#8B5CF6" },
];

const RECENT_ACTIVITY = [
  {
    id: 1,
    user: "Alice Johnson",
    action: "Booked a session",
    time: "2 hours ago",
    amount: "+$75.00",
    type: "booking",
  },
  {
    id: 2,
    user: "Bob Smith",
    action: "Left a review",
    time: "5 hours ago",
    rating: 5,
    type: "review",
  },
  {
    id: 3,
    user: "Charlie Brown",
    action: "Completed session",
    time: "1 day ago",
    amount: "+$75.00",
    type: "completion",
  },
  {
    id: 4,
    user: "Diana Prince",
    action: "Rescheduled",
    time: "2 days ago",
    type: "reschedule",
  },
  {
    id: 5,
    user: "Evan Wright",
    action: "Booked a session",
    time: "3 days ago",
    amount: "+$150.00",
    type: "booking",
  },
];

export default function AnalyticsPage() {
  const { user } = useGlobalStore();
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30d");
  const [chartData, setChartData] = useState<any[]>(DATA_SETS["30d"]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalSessions: 0,
    averageRating: 0,
    activeStudents: 0,
  });
  const [sessionDistribution, setSessionDistribution] = useState<any[]>(
    MOCK_SESSION_DISTRIBUTION
  );
  const [recentActivity, setRecentActivity] = useState<any[]>(RECENT_ACTIVITY);
  const COLOR_PALETTE = [
    "#3B82F6",
    "#10B981",
    "#8B5CF6",
    "#F59E0B",
    "#EF4444",
    "#06B6D4",
  ];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const res = await getCoachAnalytics();
        const analytics = res?.data;
        if (analytics) {
          setStats({
            totalEarnings: analytics.totalEarnings,
            totalSessions: analytics.totalSessions,
            averageRating: analytics.averageRating,
            activeStudents: analytics.activeStudents,
          });
          // Map earningsHistory to chart format
          if (
            Array.isArray(analytics.earningsHistory) &&
            analytics.earningsHistory.length > 0
          ) {
            setChartData(
              analytics.earningsHistory.map((h: any) => ({
                name: h.month,
                amount: h.amount,
              }))
            );
          }
          if (
            Array.isArray(analytics.sessionDistribution) &&
            analytics.sessionDistribution.length > 0
          ) {
            setSessionDistribution(
              analytics.sessionDistribution.map((d: any, idx: number) => ({
                name: (d.topic || d.name || "")
                  .replace(/-|_/g, " ")
                  .replace(/\b\w/g, (c: string) => c.toUpperCase()),
                value: d.count,
                color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
              }))
            ); // humanize and color
          }
          if (
            Array.isArray(analytics.recentActivity) &&
            analytics.recentActivity.length > 0
          ) {
            setRecentActivity(
              analytics.recentActivity.map((r: any) => {
                const message = r.message || "";
                const userFromMessage = message.includes(" booked")
                  ? message.split(" booked")[0]
                  : null;
                let user = userFromMessage || "";
                if (!user) {
                  const tokens = message.split(" ");
                  user =
                    tokens.length >= 2
                      ? `${tokens[0]} ${tokens[1]}`
                      : tokens[0] || "User";
                }
                return {
                  id: r.id,
                  user,
                  action: r.message,
                  time: r.date ? new Date(r.date).toLocaleString() : "",
                  type: r.type || "booking",
                  amount: r.amount,
                  rating: r.rating,
                };
              })
            ); // adapt shape
          }
        }
      } catch (error) {
        console.error("Analytics error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchAnalytics();
    }
  }, [user?.id]);

  // Update chart data when date range changes
  useEffect(() => {
    // only replace with local mock if we don't have remote data
    setChartData((prev) =>
      prev && prev.length > 0 ? prev : DATA_SETS[dateRange] || DATA_SETS["30d"]
    );
  }, [dateRange]);

  const handleDownloadReport = async () => {
    try {
      // Pull report from API
      const report = await getCoachAnalyticsReport(undefined, undefined, "csv");
      if (report instanceof Blob) {
        const url = URL.createObjectURL(report);
        const link = document.createElement("a");
        link.href = url;
        link.download = `analytics_report_${dateRange}_${
          new Date().toISOString().split("T")[0]
        }.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Report downloaded successfully");
        return;
      }

      // Fallback: create CSV content if blob not returned
      const headers = ["Metric", "Value"];
      const rows = [
        ["Total Earnings", stats.totalEarnings],
        ["Total Sessions", stats.totalSessions],
        ["Average Rating", stats.averageRating],
        ["Active Students", stats.activeStudents],
        ["Date Range", dateRange],
      ];

      const csvContent =
        "data:text/csv;charset=utf-8," +
        headers.join(",") +
        "\n" +
        rows.map((e) => e.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `analytics_report_${dateRange}_${
          new Date().toISOString().split("T")[0]
        }.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Report downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download report");
    }
  };

  // StatCard: use a colorHex (hex color) to avoid dynamic tailwind classes and improve accessibility
  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend = "up",
    trendValue,
    colorHex = "#3B82F6",
    subtext,
  }: any) => (
    <Card className="border-none shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden relative group">
      <div
        style={{ backgroundColor: colorHex }}
        className={`absolute top-0 left-0 w-1 h-full`}
      />
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div className="space-y-1 relative z-10">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              {value}
            </h3>
          </div>
          <div
            style={{ backgroundColor: `${colorHex}20` }}
            className={`p-2 rounded-xl group-hover:scale-110 transition-transform duration-200`}
          >
            <Icon className={`h-5 w-5`} style={{ color: colorHex }} />
          </div>
        </div>
        <div className="flex items-center mt-3 gap-3 text-sm">
          <div
            className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              trend === "up"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {trend === "up" ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            {trendValue}
          </div>
          <span className="text-muted-foreground ml-2 text-xs">
            {subtext || "vs last period"}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 bg-gray-50/30 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview of your performance and earnings
          </p>
        </div>
        <div
          className="flex gap-2"
          role="group"
          aria-label="Analytics controls"
        >
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px] bg-white">
              <Calendar className="mr-2 h-4 w-4 text-gray-500" />
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="bg-black text-white hover:bg-gray-800"
            onClick={handleDownloadReport}
            aria-label="Download analytics report"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Earnings"
          value={`$${stats.totalEarnings.toLocaleString()}`}
          icon={Wallet}
          trend="up"
          trendValue="+12.5%"
          colorHex="#3B82F6"
        />
        <StatCard
          title="Total Sessions"
          value={stats.totalSessions}
          icon={Clock}
          trend="up"
          trendValue="+8.2%"
          colorHex="#8B5CF6"
        />
        <StatCard
          title="Average Rating"
          value={stats.averageRating}
          icon={Star}
          trend="up"
          trendValue="+0.1"
          colorHex="#F59E0B"
        />
        <StatCard
          title="Active Students"
          value={stats.activeStudents}
          icon={Users}
          trend="up"
          trendValue="+4"
          colorHex="#10B981"
        />
      </div>

      {/* Main Content Grid */}
      <div className="space-y-8">
        {/* Earnings Chart - Full Width */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Earnings Overview</CardTitle>
                <CardDescription>
                  Earnings over time based on selected period
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-gray-600"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <div className="px-6 -mt-3 mb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  Selected range
                </div>
                <div className="font-semibold text-gray-900">
                  {dateRange === "7d"
                    ? "Last 7 Days"
                    : dateRange === "30d"
                    ? "Last 30 Days"
                    : dateRange === "3m"
                    ? "Last 3 Months"
                    : "Year to Date"}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">
                    Total in period
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    $
                    {(chartData || [])
                      .reduce((s, d) => s + (d.amount || 0), 0)
                      .toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Sessions</div>
                  <div className="text-lg font-bold text-gray-900">
                    {stats.totalSessions}
                  </div>
                </div>
                <div className="text-right hidden md:block">
                  <div className="text-xs text-muted-foreground">
                    Avg Rating
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {stats.averageRating?.toFixed
                      ? stats.averageRating.toFixed(1)
                      : stats.averageRating}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorEarnings"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F3F4F6"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `$${value}`}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => [`$${value}`, "Earnings"]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      padding: "12px",
                    }}
                    cursor={{
                      stroke: "#3B82F6",
                      strokeWidth: 1,
                      strokeDasharray: "5 5",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorEarnings)"
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Row: Session Types & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Session Types */}
          <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <CardTitle>Session Types</CardTitle>
              <CardDescription>Distribution by topic</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full relative flex flex-col lg:flex-row lg:items-center gap-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sessionDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {sessionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      formatter={(value, entry: any) => (
                        <span className="text-sm font-medium text-gray-600 ml-2">
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Legend list */}
                <div className="w-full lg:w-1/2 flex flex-col gap-3 px-4 py-2">
                  <div className="text-sm text-muted-foreground">Breakdown</div>
                  {sessionDistribution.map((item, idx) => {
                    const total =
                      sessionDistribution.reduce(
                        (s, x) => s + (x.value || 0),
                        0
                      ) || 1;
                    const pct = Math.round(((item.value || 0) / total) * 100);
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.value} • {pct}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5 max-h-[320px] overflow-y-auto pr-2">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                        ${
                          activity.type === "booking"
                            ? "bg-blue-100 text-blue-600"
                            : activity.type === "review"
                            ? "bg-yellow-100 text-yellow-600"
                            : activity.type === "completion"
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {activity.user.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {activity.user}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.action}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {activity.amount && (
                        <p className="text-sm font-medium text-green-600">
                          {activity.amount}
                        </p>
                      )}
                      {activity.rating && (
                        <div className="flex items-center justify-end text-yellow-500">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="text-xs ml-1 font-medium">
                            {activity.rating}.0
                          </span>
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() =>
                    toast.info("Open full activity log coming soon")
                  }
                >
                  View all activity
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
