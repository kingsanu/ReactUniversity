"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import {
  Eye,
  Users,
  Clock,
  MousePointer,
  CheckCircle,
  TrendingUp,
  FileText,
  Calendar,
  Heart,
  UserPlus,
  UserCheck,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useTelemetryAnalytics } from "@/hooks/useTelemetryAnalytics";

const COLORS = ["#3b82f6", "#22c55e", "#eab308", "#ef4444", "#8b5cf6", "#ec4899"];

interface TelemetryDashboardProps {
  period?: "day" | "week" | "month" | "year";
}

export function TelemetryDashboard({ period = "week" }: TelemetryDashboardProps) {
  const { data: analytics, isLoading, error } = useTelemetryAnalytics(period);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-24" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="flex items-center gap-3 py-6">
          <div className="p-2 rounded-full bg-amber-100">
            <Eye className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="font-medium text-amber-800">Telemetry data unavailable</p>
            <p className="text-sm text-amber-600">
              Backend telemetry API not yet configured. Events are being collected locally.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { metrics } = analytics;

  // Prepare event breakdown for chart
  const eventChartData = Object.entries(metrics.eventBreakdown || {}).map(([event, count]) => ({
    name: event.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    value: count,
  }));

  // Format duration
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  // Format percentage
  const formatPercent = (value: number) => `${Math.round((value || 0) * 100)}%`;

  return (
    <div className="space-y-6">
      {/* DAU / WAU / MAU Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Daily Active Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">
              {(metrics.dau || 0).toLocaleString()}
            </div>
            <p className="text-xs text-blue-600 mt-1">DAU today</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Weekly Active Users</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">
              {(metrics.wau || 0).toLocaleString()}
            </div>
            <p className="text-xs text-green-600 mt-1">WAU this week</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Monthly Active Users</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">
              {(metrics.mau || 0).toLocaleString()}
            </div>
            <p className="text-xs text-purple-600 mt-1">MAU this month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Retention Rate</CardTitle>
            <Heart className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">
              {formatPercent(metrics.retentionRate || 0)}
            </div>
            <p className="text-xs text-orange-600 mt-1">Users returning</p>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(metrics.totalPageViews || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">This {period}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(metrics.avgSessionDuration || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Time on site</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pages Per Session</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(metrics.pagesPerSession || 0).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Avg. depth</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercent(metrics.bounceRate || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Single page visits</p>
          </CardContent>
        </Card>
      </div>

      {/* New vs Returning Users */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-500" />
              New vs Returning Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm">New Users</span>
                </div>
                <span className="font-semibold">{(metrics.newUsers || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm">Returning Users</span>
                </div>
                <span className="font-semibold">{(metrics.returningUsers || 0).toLocaleString()}</span>
              </div>
              <div className="h-4 bg-muted rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-blue-500"
                  style={{
                    width: `${((metrics.newUsers || 0) / ((metrics.newUsers || 0) + (metrics.returningUsers || 1))) * 100}%`,
                  }}
                />
                <div className="h-full bg-green-500 flex-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Top Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(metrics.topPages || []).length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={(metrics.topPages || []).slice(0, 5)}
                  layout="vertical"
                  margin={{ left: 0, right: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => v.toLocaleString()} />
                  <YAxis
                    type="category"
                    dataKey="page"
                    width={120}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => v.replace("/dashboard", "").slice(0, 18) || "/home"}
                  />
                  <Tooltip formatter={(v: number) => [v.toLocaleString(), "Views"]} />
                  <Bar dataKey="views" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                No page view data yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Event Breakdown & Completion Rates */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Event Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              Event Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {eventChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={eventChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                    }
                    labelLine={false}
                  >
                    {eventChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => v.toLocaleString()} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                No event data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completion Rates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Completion Rates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Resume Builder</span>
                  <Badge variant="secondary">
                    {Math.round((metrics.completionRates?.resumeBuilder || 0) * 100)}%
                  </Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${(metrics.completionRates?.resumeBuilder || 0) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Assessments</span>
                  <Badge variant="secondary">
                    {Math.round((metrics.completionRates?.assessments || 0) * 100)}%
                  </Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${(metrics.completionRates?.assessments || 0) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Coach Onboarding</span>
                  <Badge variant="secondary">
                    {Math.round((metrics.completionRates?.coachOnboarding || 0) * 100)}%
                  </Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all"
                    style={{ width: `${(metrics.completionRates?.coachOnboarding || 0) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Profile Setup</span>
                  <Badge variant="secondary">
                    {Math.round((metrics.completionRates?.profileSetup || 0) * 100)}%
                  </Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all"
                    style={{ width: `${(metrics.completionRates?.profileSetup || 0) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DAU Trend Chart */}
      {metrics.dailyActiveUsersTrend && metrics.dailyActiveUsersTrend.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Daily Active Users Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={metrics.dailyActiveUsersTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  fill="#93c5fd"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
