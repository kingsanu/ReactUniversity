"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  DollarSign,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Activity,
  Award,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MousePointer,
} from "lucide-react";
import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";
import { useTranslation } from "react-i18next";
import { TelemetryDashboard } from "../_components/TelemetryDashboard";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");

  const { data: analytics, isLoading, error, refetch } = useAdminAnalytics(period);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("admin.analytics.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("admin.analytics.loading")}
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-24" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-32 mb-2" />
                <div className="h-3 bg-muted rounded w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("admin.analytics.title")}
            </h1>
            <p className="text-muted-foreground">
              Platform analytics overview
            </p>
          </div>
        </div>
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <Activity className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-red-700 mb-2">Server Error</h3>
            <p className="text-red-600 text-center max-w-md mb-4">
              Unable to load analytics data. The server may be temporarily unavailable or there was a network issue.
            </p>
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("admin.analytics.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("admin.analytics.subtitle")}
          </p>
        </div>
        <Select value={period} onValueChange={(v: any) => setPeriod(v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">
              {t("admin.analytics.period.week")}
            </SelectItem>
            <SelectItem value="month">
              {t("admin.analytics.period.month")}
            </SelectItem>
            <SelectItem value="year">
              {t("admin.analytics.period.year")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs for different analytics views */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Platform Overview</TabsTrigger>
          <TabsTrigger value="behavior" className="flex items-center gap-2">
            <MousePointer className="h-4 w-4" />
            User Behavior
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.analytics.totalUsers")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.stats.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {analytics.stats.monthlyGrowth.users >= 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-600" /> +
                  {analytics.stats.monthlyGrowth.users}%
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-600" />{" "}
                  {analytics.stats.monthlyGrowth.users}%
                </>
              )}
              <span className="text-muted-foreground">
                {t("admin.analytics.fromLastPeriod")}
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.analytics.totalRevenue")}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analytics.stats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {analytics.stats.monthlyGrowth.revenue >= 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-600" /> +
                  {analytics.stats.monthlyGrowth.revenue}%
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-600" />{" "}
                  {analytics.stats.monthlyGrowth.revenue}%
                </>
              )}
              <span className="text-muted-foreground">
                {t("admin.analytics.fromLastPeriod")}
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.analytics.activeCourses")}
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.stats.activeCourses}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {analytics.stats.monthlyGrowth.courses >= 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-600" /> +
                  {analytics.stats.monthlyGrowth.courses}%
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-600" />{" "}
                  {analytics.stats.monthlyGrowth.courses}%
                </>
              )}
              <span className="text-muted-foreground">
                {t("admin.analytics.fromLastPeriod")}
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.analytics.growthRate")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{analytics.stats.growthRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {t("admin.analytics.overallPlatformGrowth")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>
              {t("admin.analytics.cards.revenueTransactions")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={analytics.revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="revenue" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                <Bar
                  dataKey="transactions"
                  fill="#60a5fa"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t("admin.analytics.charts.userGrowthTrend")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={analytics.userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name={t("admin.analytics.chartNames.totalUsers")}
                />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name={t("admin.analytics.chartNames.newUsers")}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers and Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Top Coaches */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              {t("admin.analytics.cards.topCoaches")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topCoaches.map((coach, index) => (
                <div
                  key={coach.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{coach.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {coach.sessions} sessions • ⭐ {coach.rating}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(coach.earnings)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Courses */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              {t("admin.analytics.cards.topCourses")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topCourses.map((course, index) => (
                <div key={course.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm truncate flex-1">
                      {course.title}
                    </p>
                    <Badge variant="secondary">{course.enrollments}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>⭐ {course.rating}</span>
                    <span className="font-semibold">
                      {formatCurrency(course.revenue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              {t("admin.analytics.cards.recentActivity")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 rounded-full p-1.5 ${
                      activity.type === "user"
                        ? "bg-blue-500/10"
                        : activity.type === "transaction"
                        ? "bg-green-500/10"
                        : activity.type === "course"
                        ? "bg-purple-500/10"
                        : "bg-orange-500/10"
                    }`}
                  >
                    {activity.type === "user" && (
                      <Users className="h-3 w-3 text-blue-500" />
                    )}
                    {activity.type === "transaction" && (
                      <DollarSign className="h-3 w-3 text-green-500" />
                    )}
                    {activity.type === "course" && (
                      <BookOpen className="h-3 w-3 text-purple-500" />
                    )}
                    {activity.type === "session" && (
                      <Clock className="h-3 w-3 text-orange-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </div>
        </TabsContent>

        <TabsContent value="behavior">
          <TelemetryDashboard period={period} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
