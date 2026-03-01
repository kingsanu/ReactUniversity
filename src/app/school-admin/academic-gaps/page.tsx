"use client";

// School-Admin view of Academic Gap Analysis — shows ALL school students (counselor view shows only assigned).
// Re-uses the same hooks from useAcademicGapQueries.

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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Search, TrendingDown, BookOpen, Lightbulb, AlertTriangle, Target, BarChart3 } from "lucide-react";
import {
  useAcademicGapSummary,
  useStudentAcademicGaps,
  useStudentCourseRecommendations,
} from "@/hooks/useAcademicGapQueries";
import type { AcademicGapSummaryItem } from "@/types/academicGap";

export default function SchoolAdminAcademicGapsPage() {
  const { t } = useTranslation();
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");

  const { data: summary, isLoading: summaryLoading } = useAcademicGapSummary({ limit: 100 });
  const { data: gaps, isLoading: gapsLoading } = useStudentAcademicGaps(selectedStudentId);
  const { data: recs, isLoading: recsLoading } = useStudentCourseRecommendations(selectedStudentId);

  const filteredStudents = (summary?.data ?? []).filter((s: AcademicGapSummaryItem) =>
    !search || s.studentName?.toLowerCase().includes(search.toLowerCase())
  );

  const priorityColor = (level: string) => {
    if (level === "behind") return "text-red-600 bg-red-50";
    if (level === "at_risk") return "text-orange-600 bg-orange-50";
    return "text-green-600 bg-green-50";
  };

  if (summaryLoading) {
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
          {t("schoolAdmin.gaps.title", "Academic Gap Analysis")}
        </h1>
        <p className="text-lg text-gray-500 font-medium">
          {t("schoolAdmin.gaps.subtitle", "School-wide view of academic gaps and AI-powered course recommendations.")}
        </p>
      </motion.div>

      {/* Summary Stats */}
      {summary && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6 text-center">
                <BarChart3 className="h-6 w-6 text-teal-500 mx-auto mb-1" />
                <p className="text-3xl font-bold">{summary.summary?.totalStudents ?? 0}</p>
                <p className="text-sm text-gray-500">Total Students</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6 text-center">
                <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-1" />
                <p className="text-3xl font-bold text-red-600">{summary.summary?.behind ?? 0}</p>
                <p className="text-sm text-gray-500">Behind Track</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6 text-center">
                <Target className="h-6 w-6 text-orange-500 mx-auto mb-1" />
                <p className="text-3xl font-bold text-orange-600">{summary.summary?.atRisk ?? 0}</p>
                <p className="text-sm text-gray-500">At Risk</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6 text-center">
                <BookOpen className="h-6 w-6 text-green-500 mx-auto mb-1" />
                <p className="text-3xl font-bold text-green-600">{summary.summary?.onTrack ?? 0}</p>
                <p className="text-sm text-gray-500">On Track</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="rounded-xl bg-gray-100">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detail" disabled={!selectedStudentId}>Student Detail</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredStudents.length === 0 && (
                    <div className="text-center py-12">
                      <TrendingDown className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-400">No students found.</p>
                    </div>
                  )}
                  {filteredStudents.map((s: AcademicGapSummaryItem) => (
                    <div
                      key={s.studentId}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => { setSelectedStudentId(s.studentId); setTab("detail"); }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{s.studentName}</p>
                        <p className="text-sm text-gray-500">{s.missingRequiredCourses} missing courses · {s.creditDeficit} credit deficit</p>
                      </div>
                      <div className="w-40 hidden md:block">
                        <p className="text-xs text-gray-400 truncate">{s.topGap}</p>
                      </div>
                      <Badge className={`${priorityColor(s.overallStatus)} border-0 font-medium capitalize`}>
                        {s.overallStatus?.replace("_", " ")}
                      </Badge>
                      <Button size="sm" variant="ghost" className="text-teal-600 hover:bg-teal-50">
                        View Gaps →
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detail" className="mt-6 space-y-6">
            {gapsLoading || recsLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" onClick={() => { setTab("overview"); setSelectedStudentId(""); }}>
                    ← Back to Overview
                  </Button>
                </div>

                {/* Gaps */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-red-500" />
                      Academic Gaps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {gaps?.creditGaps?.length ? (
                      <div className="space-y-3">
                        {gaps.creditGaps.map((g, i: number) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-red-900">{g.category}</p>
                              <p className="text-xs text-red-600">{g.recommendation} (deficit: {g.deficit} credits)</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-8">No gaps detected for this student.</p>
                    )}
                  </CardContent>
                </Card>

                {/* AI Recommendations */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      AI Course Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recs?.nextSemester?.length || recs?.longTerm?.length ? (
                      <div className="space-y-3">
                        {[...(recs.nextSemester ?? []), ...(recs.longTerm ?? [])].map((r, i: number) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                            <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-sm font-medium">{r.courseName}</p>
                              <p className="text-xs text-gray-500">{r.reason}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-8">No recommendations available.</p>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
