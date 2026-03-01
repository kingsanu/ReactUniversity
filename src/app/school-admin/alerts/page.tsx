"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Search, CheckCheck, Eye, AlertTriangle, Info, AlertCircle, BellOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  useAlerts,
  useAlertSummary,
  useUpdateAlert,
  useBulkAlertAction,
} from "@/hooks/useAlertQueries";
import type { AlertType, AlertPriority, AlertStatus } from "@/types/alert";

const priorityColors: Record<AlertPriority, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-blue-100 text-blue-700",
};

const typeIcons: Record<AlertType, React.ReactNode> = {
  grade_drop: <AlertTriangle className="h-4 w-4 text-red-500" />,
  missing_assessment: <AlertCircle className="h-4 w-4 text-orange-500" />,
  credit_gap: <Info className="h-4 w-4 text-blue-500" />,
  no_career_path: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  inactive: <Info className="h-4 w-4 text-gray-500" />,
};

export default function SchoolAdminAlertsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);

  const { data: alerts, isLoading } = useAlerts({
    type: (typeFilter !== "all" ? typeFilter : undefined) as AlertType | undefined,
    priority: (priorityFilter !== "all" ? priorityFilter : undefined) as AlertPriority | undefined,
    status: (statusFilter !== "all" ? statusFilter : undefined) as AlertStatus | undefined,
    page,
    limit: 20,
  });
  const { data: summary } = useAlertSummary();
  const updateAlert = useUpdateAlert();
  const bulk = useBulkAlertAction();

  const handleDismiss = (alertId: string) => {
    updateAlert.mutate(
      { alertId, payload: { status: "dismissed" } },
      {
        onSuccess: () => toast.success(t("schoolAdmin.alerts.dismissed", "Alert dismissed")),
        onError: () => toast.error(t("schoolAdmin.alerts.dismissError", "Failed to dismiss")),
      }
    );
  };

  const handleMarkRead = (alertId: string) => {
    updateAlert.mutate(
      { alertId, payload: { status: "acknowledged" } },
      { onSuccess: () => toast.success(t("schoolAdmin.alerts.markedRead", "Marked as acknowledged")) }
    );
  };

  const handleBulkDismiss = () => {
    if (!selected.length) return;
    bulk.mutate(
      { alertIds: selected, action: "dismiss" },
      {
        onSuccess: () => { toast.success(t("schoolAdmin.alerts.bulkDismissed", `${selected.length} alerts dismissed`)); setSelected([]); },
        onError: () => toast.error(t("schoolAdmin.alerts.bulkError", "Bulk action failed")),
      }
    );
  };

  const filteredAlerts = (alerts?.data ?? []).filter(
    (a) => !search || a.message?.toLowerCase().includes(search.toLowerCase()) || a.studentName?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {t("schoolAdmin.alerts.title", "School Alerts")}
        </h1>
        <p className="text-lg text-gray-500 font-medium">
          {t("schoolAdmin.alerts.subtitle", "School-wide alerts: grade drops, missing assessments, credit gaps, and inactivity.")}
        </p>
      </motion.div>

      {/* Summary */}
      {summary && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold">{summary.total ?? 0}</p>
                <p className="text-sm text-gray-500">Total Alerts</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-red-600">{summary.byPriority?.critical ?? 0}</p>
                <p className="text-sm text-gray-500">Critical</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-orange-500">{summary.newSinceLastLogin ?? 0}</p>
                <p className="text-sm text-gray-500">New Since Login</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-yellow-500">{summary.byPriority?.high ?? 0}</p>
                <p className="text-sm text-gray-500">High Priority</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Filters & bulk */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search alerts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-56 h-9" />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-44 h-9"><SelectValue placeholder="Alert Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="grade_drop">Grade Drop</SelectItem>
                    <SelectItem value="missing_assessment">Missing Assessment</SelectItem>
                    <SelectItem value="credit_gap">Credit Gap</SelectItem>
                    <SelectItem value="no_career_path">No Career Path</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-36 h-9"><SelectValue placeholder="Priority" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36 h-9"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="dismissed">Dismissed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selected.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkDismiss}
                  disabled={bulk.isPending}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <BellOff className="h-4 w-4 mr-1" />
                  Dismiss {selected.length}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-10 pl-6">
                    <input
                      type="checkbox"
                      checked={selected.length === filteredAlerts.length && filteredAlerts.length > 0}
                      onChange={() => setSelected(selected.length === filteredAlerts.length ? [] : filteredAlerts.map((a) => a.id))}
                      className="rounded"
                    />
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16 text-gray-400">
                      <Bell className="h-10 w-10 mx-auto mb-2 text-gray-200" />
                      No alerts match your filters.
                    </TableCell>
                  </TableRow>
                ) : filteredAlerts.map((a) => (
                  <TableRow key={a.id} className="hover:bg-gray-50/50">
                    <TableCell className="pl-6">
                      <input
                        type="checkbox"
                        checked={selected.includes(a.id)}
                        onChange={() => toggleSelect(a.id)}
                        className="rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {typeIcons[a.type as AlertType]}
                        <span className="text-xs text-gray-600 capitalize">{a.type?.replace("_", " ")}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-sm">{a.studentName ?? "—"}</TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-xs truncate">{a.message}</TableCell>
                    <TableCell>
                      <Badge className={`${priorityColors[a.priority as AlertPriority]} border-0 text-xs`}>
                        {a.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={a.status === "active" ? "default" : "secondary"} className="capitalize text-xs">
                        {a.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        {a.status === "active" && (
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-blue-500 hover:bg-blue-50" onClick={() => handleMarkRead(a.id)}>
                            <Eye className="h-3 w-3" />
                          </Button>
                        )}
                        {a.status !== "dismissed" && (
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50" onClick={() => handleDismiss(a.id)}>
                            <BellOff className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {alerts && alerts.totalPages > 1 && (
              <div className="flex justify-center gap-2 py-4 border-t">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => { setPage((p) => p - 1); setSelected([]); }}>Previous</Button>
                <span className="text-sm text-gray-500 self-center">{page} / {alerts.totalPages}</span>
                <Button variant="outline" size="sm" disabled={page >= alerts.totalPages} onClick={() => { setPage((p) => p + 1); setSelected([]); }}>Next</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
