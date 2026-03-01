"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  CalendarClock,
  FileText,
  Bell,
  TrendingDown,
  ChevronRight,
  Search,
  BookOpen,
  Clock,
  Radar,
  AlertTriangle,
} from "lucide-react";
import { useCounselorDashboard } from "@/hooks/useCounselorDashboard";
import { useMyCounselorStudents } from "@/hooks/useSchoolProfileQueries";

export default function CounselorDashboardPage() {
  const [search, setSearch] = useState("");

  const { data: dashData, isLoading: dashLoading } = useCounselorDashboard();
  const { data: studentsData, isLoading: studentsLoading } =
    useMyCounselorStudents({ limit: 50, search: search || undefined });

  const students = (studentsData as any)?.data ?? [];
  const totalStudents =
    (studentsData as any)?.total ?? (dashData as any)?.assignedCount ?? 0;
  const pendingFollowUps = (dashData as any)?.followUps ?? 0;
  const recentNotesCount = (dashData as any)?.recentNotes?.length ?? 0;
  const overdueFollowUps = (dashData as any)?.overdueFollowUps ?? 0;

  const isLoading = dashLoading || studentsLoading;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Counselor Overview
        </h1>
        <p className="text-lg text-gray-500 font-medium mt-1">
          Your caseload summary and upcoming actions.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-indigo-50">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <Badge variant="secondary" className="text-xs">
                Caseload
              </Badge>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">Assigned Students</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-yellow-50">
                <CalendarClock className="h-5 w-5 text-yellow-600" />
              </div>
              <Badge variant="secondary" className="text-xs">
                Due
              </Badge>
            </div>
            {dashLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold text-yellow-600">
                {pendingFollowUps}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-1">Pending Follow-ups</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                Action
              </Badge>
            </div>
            {dashLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold text-red-600">
                {overdueFollowUps}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-1">Overdue Follow-ups</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-teal-50">
                <FileText className="h-5 w-5 text-teal-600" />
              </div>
              <Badge variant="secondary" className="text-xs">
                Recent
              </Badge>
            </div>
            {dashLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold text-teal-600">
                {recentNotesCount}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-1">Notes This Week</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {[
          {
            label: "My Students",
            href: "/counselor/students",
            icon: Users,
            color:
              "text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-indigo-100",
          },
          {
            label: "Academic Gaps",
            href: "/counselor/academic-gaps",
            icon: TrendingDown,
            color:
              "text-orange-600 bg-orange-50 hover:bg-orange-100 border-orange-100",
          },
          {
            label: "360° Evaluations",
            href: "/counselor/evaluations",
            icon: Radar,
            color:
              "text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-100",
          },
          {
            label: "Alerts",
            href: "/counselor/alerts",
            icon: Bell,
            color: "text-red-600 bg-red-50 hover:bg-red-100 border-red-100",
          },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <Card
              className={`border cursor-pointer transition-all hover:shadow-md ${item.color}`}
            >
              <CardContent className="pt-4 pb-4 flex items-center gap-3">
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="text-sm font-semibold">{item.label}</span>
                <ChevronRight className="h-4 w-4 ml-auto opacity-60" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </motion.div>

      {/* Students + Follow-ups */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Assigned Students */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4 text-indigo-600" />
                  Assigned Students
                </CardTitle>
                <Link href="/counselor/students">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-indigo-600 hover:bg-indigo-50"
                  >
                    View All →
                  </Button>
                </Link>
              </div>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {studentsLoading ? (
                <div className="p-4 space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">
                    {search
                      ? "No students match your search."
                      : "No students assigned yet."}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="pl-6">Student</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Assessment</TableHead>
                      <TableHead className="pr-6">Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.slice(0, 8).map((s: any) => (
                      <TableRow key={s.id} className="hover:bg-gray-50/50">
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="text-[10px] bg-indigo-100 text-indigo-700 font-bold">
                                {s.name?.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{s.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {s.gradeLevel ? `Gr ${s.gradeLevel}` : "—"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`text-xs border-0 ${
                              s.assessmentStatus === "completed"
                                ? "bg-green-100 text-green-700"
                                : s.assessmentStatus === "in_progress"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {s.assessmentStatus?.replace("_", " ") ??
                              "Not started"}
                          </Badge>
                        </TableCell>
                        <TableCell className="pr-6">
                          <div className="w-20">
                            <Progress
                              value={s.progressPercent ?? 0}
                              className="h-1.5"
                            />
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {s.progressPercent ?? 0}%
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Follow-ups */}
        <div>
          <Card className="border-0 shadow-lg h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-yellow-600" />
                Upcoming Follow-ups
              </CardTitle>
              <CardDescription>
                Notes with a scheduled follow-up date
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dashLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : (dashData as any)?.pendingFollowUpsList?.length ? (
                <div className="space-y-3">
                  {(dashData as any).pendingFollowUpsList.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 p-3 bg-yellow-50/60 border border-yellow-100 rounded-lg"
                    >
                      <CalendarClock className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {item.studentName}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-1">
                          {item.content}
                        </p>
                        <p className="text-[10px] text-yellow-700 mt-0.5">
                          {item.followUpDate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <CalendarClock className="h-9 w-9 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No upcoming follow-ups</p>
                  <p className="text-xs text-gray-300 mt-1">
                    Add a follow-up date to a counselor note to see it here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Recent Notes */}
      {(dashData as any)?.recentNotes?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-teal-600" />
                Recent Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {(dashData as any).recentNotes.map((note: any) => (
                  <div
                    key={note.id}
                    className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-lg shadow-sm"
                  >
                    <BookOpen className="h-4 w-4 text-teal-500 mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {note.studentName}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-[10px] capitalize shrink-0"
                        >
                          {note.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                        {note.content}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}