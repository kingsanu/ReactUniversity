"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { Users, Search, Bell, GraduationCap, BookOpen, ChevronRight } from "lucide-react";
import { useMyCounselorStudents } from "@/hooks/useSchoolProfileQueries";

const assessmentStatusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  not_started: "bg-gray-100 text-gray-600",
};

export default function CounselorStudentsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useMyCounselorStudents({
    search: search || undefined,
    status: status || undefined,
    sortBy,
    sortOrder: "asc",
    page,
    limit: 20,
  });

  if (isLoading) {
    return (<div className="space-y-6"><Skeleton className="h-10 w-64" /><Skeleton className="h-[500px] w-full" /></div>);
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {t("counselor.students.title", "My Students")}
        </h1>
        <p className="text-lg text-gray-500 font-medium">
          {t("counselor.students.subtitle", "View and manage your assigned students.")}
        </p>
      </motion.div>

      {/* Toolbar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search students..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-10" />
        </div>
        <Select value={status} onValueChange={(v) => { setStatus(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="at_risk">At Risk</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="gpa">GPA</SelectItem>
            <SelectItem value="alertCount">Alerts</SelectItem>
            <SelectItem value="gradeLevel">Grade</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Students Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-600" />
              Students {data && <Badge variant="secondary">{data.total}</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead>Credit Progress</TableHead>
                  <TableHead>Assessments</TableHead>
                  <TableHead>Career Path</TableHead>
                  <TableHead>Alerts</TableHead>
                  <TableHead>Last Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.map((s) => (
                  <TableRow
                    key={s.id}
                    className="cursor-pointer hover:bg-indigo-50/50 transition-colors"
                    onClick={() => router.push(`/counselor/students/${s.id}`)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{s.gradeLevel}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">{s.gpa.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="space-y-1 min-w-[120px]">
                        <Progress value={s.creditProgress.percentage} className="h-2" />
                        <p className="text-xs text-gray-500">{s.creditProgress.earned}/{s.creditProgress.required}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {Object.entries(s.assessmentStatus).map(([type, assessStatus]) => (
                          <Badge key={type} className={`text-xs ${assessmentStatusColors[assessStatus]}`}>
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{s.careerPath || "—"}</TableCell>
                    <TableCell>
                      {s.alertCount > 0 ? (
                        <Badge className="bg-red-100 text-red-700">
                          <Bell className="h-3 w-3 mr-1" />{s.alertCount}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {new Date(s.lastActive).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {(!data?.data || data.data.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-400 py-12">
                      No students assigned to you yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <span className="text-sm text-gray-500 self-center">{page} / {data.totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
