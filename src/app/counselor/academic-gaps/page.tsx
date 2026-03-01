"use client";

import { useState } from "react";
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

export default function AcademicGapsPage() {
  const { t } = useTranslation();
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [tab, setTab] = useState("overview");

  const { data: summary, isLoading: summaryLoading } = useAcademicGapSummary({ limit: 50 });
  const { data: gaps, isLoading: gapsLoading } = useStudentAcademicGaps(selectedStudentId);
  const { data: recs, isLoading: recsLoading } = useStudentCourseRecommendations(selectedStudentId);

  const priorityColor = (level: string) => {
    if (level === "behind") return "text-red-600 bg-red-50";
    if (level === "at_risk") return "text-orange-600 bg-orange-50";
    return "text-green-600 bg-green-50";
  };

  if (summaryLoading) {
    return (<div className="space-y-6"><Skeleton className="h-10 w-64" /><Skeleton className="h-[500px] w-full" /></div>);
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {t("schoolAdmin.gaps.title", "Academic Gap Analysis")}
        </h1>
        <p className="text-lg text-gray-500 font-medium">
          {t("schoolAdmin.gaps.subtitle", "Identify academic gaps and get AI-powered course recommendations.")}
        </p>
      </motion.div>

      {/* Summary Stats */}
      {summary && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold">{summary.summary.totalStudents}</p>
                <p className="text-sm text-gray-500">Total Students</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-red-600">{summary.summary.behind}</p>
                <p className="text-sm text-gray-500">Behind</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-orange-600">{summary.summary.atRisk}</p>
                <p className="text-sm text-gray-500">At Risk</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-green-600">{summary.summary.onTrack}</p>
                <p className="text-sm text-gray-500">On Track</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Student List + Detail */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student List */}
          <Card className="border-0 shadow-lg lg:col-span-1">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-teal-600" />
                Students
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-[600px] overflow-y-auto">
              {summary?.data?.map((s: AcademicGapSummaryItem) => (
                <button
                  key={s.studentId}
                  onClick={() => setSelectedStudentId(s.studentId)}
                  className={`w-full text-left px-4 py-3 border-b hover:bg-gray-50 transition-colors ${
                    selectedStudentId === s.studentId ? "bg-teal-50 border-l-4 border-l-teal-500" : ""
                  }`}
                >
                  <p className="font-medium text-sm">{s.studentName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`text-xs ${priorityColor(s.overallStatus)}`}>{s.overallStatus.replace("_", " ")}</Badge>
                    <span className="text-xs text-gray-400">{s.missingRequiredCourses} missing</span>
                  </div>
                </button>
              ))}
              {(!summary?.data || summary.data.length === 0) && (
                <p className="text-gray-400 text-center py-8">No gap data available</p>
              )}
            </CardContent>
          </Card>

          {/* Student Detail */}
          <div className="lg:col-span-2">
            {!selectedStudentId ? (
              <Card className="border-0 shadow-lg h-full flex items-center justify-center">
                <CardContent className="text-center py-16">
                  <Target className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400">Select a student to view gap analysis</p>
                </CardContent>
              </Card>
            ) : (
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="gaps"><TrendingDown className="h-4 w-4 mr-1" />Gaps</TabsTrigger>
                  <TabsTrigger value="recommendations"><Lightbulb className="h-4 w-4 mr-1" />AI Recommendations</TabsTrigger>
                </TabsList>

                <TabsContent value="gaps">
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-100">
                      <CardTitle>Gap Analysis</CardTitle>
                      <CardDescription>Credit, course, pace, and career alignment gaps</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                      {gapsLoading ? (
                        <Skeleton className="h-[200px] w-full" />
                      ) : gaps ? (
                        <>
                          {/* Credit Gaps */}
                          {gaps.creditGaps.length > 0 && (
                            <div>
                              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-red-500" />Credit Gaps
                              </h3>
                              <div className="space-y-3">
                                {gaps.creditGaps.map((g, i) => (
                                  <div key={i} className="p-3 rounded-lg border bg-red-50/50">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="font-medium text-sm">{g.category}</span>
                                      <span className="text-sm text-red-600 font-semibold">-{g.deficit} credits</span>
                                    </div>
                                    <Progress value={(g.creditsEarned / g.creditsRequired) * 100} className="h-2" />
                                    <p className="text-xs text-gray-500 mt-1">{g.creditsEarned}/{g.creditsRequired} credits earned</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {/* Course Gaps */}
                          {gaps.courseGaps.length > 0 && (
                            <div>
                              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-orange-500" />Missing Required Courses
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {gaps.courseGaps.map((g, i) => (
                                  <Badge key={i} variant="secondary" className="py-1.5">
                                    {g.courseName}
                                    <span className="ml-1 text-xs text-gray-400">({g.courseCode})</span>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {/* Career Gaps */}
                          {gaps.careerGaps.length > 0 && (
                            <div>
                              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                <Target className="h-4 w-4 text-purple-500" />Career Alignment Gaps
                              </h3>
                              <div className="space-y-2">
                                {gaps.careerGaps.map((g, i) => (
                                  <div key={i} className="p-3 rounded-lg border bg-purple-50/50">
                                    <p className="font-medium text-sm">{g.careerPath}</p>
                                    <p className="text-xs text-gray-500 mt-1">{g.missingSkills.join(", ")}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {gaps.creditGaps.length === 0 && gaps.courseGaps.length === 0 && gaps.careerGaps.length === 0 && (
                            <p className="text-green-600 text-center py-8 font-medium">No gaps detected — student is on track!</p>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-400 text-center py-8">Unable to load gap data</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="recommendations">
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-100">
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-teal-600" />
                        AI Course Recommendations
                      </CardTitle>
                      <CardDescription>AI-generated recommendations based on gap analysis and career goals</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {recsLoading ? (
                        <Skeleton className="h-[200px] w-full" />
                      ) : (recs?.nextSemester?.length || recs?.longTerm?.length) ? (
                        <div className="space-y-4">
                          {recs.nextSemester.length > 0 && (
                            <div>
                              <h3 className="font-semibold text-sm mb-3">Next Semester</h3>
                              {recs.nextSemester.map((r, i) => (
                                <div key={i} className="p-4 rounded-lg border hover:shadow-md transition-shadow mb-3">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <p className="font-semibold">{r.courseName}</p>
                                      <p className="text-sm text-gray-500 font-mono">{r.courseCode}</p>
                                    </div>
                                    <div className="text-right">
                                      <Badge className="bg-teal-100 text-teal-700">{r.credits} credits</Badge>
                                      <p className="text-xs text-gray-400 mt-1">{r.priority} priority</p>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-2">{r.reason}</p>
                                  <Badge variant="secondary" className="text-xs mt-1">{r.source.replace("_", " ")}</Badge>
                                </div>
                              ))}
                            </div>
                          )}
                          {recs.longTerm.length > 0 && (
                            <div>
                              <h3 className="font-semibold text-sm mb-3">Long Term</h3>
                              {recs.longTerm.map((r, i) => (
                                <div key={i} className="p-4 rounded-lg border hover:shadow-md transition-shadow mb-3">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <p className="font-semibold">{r.courseName}</p>
                                      <p className="text-sm text-gray-500 font-mono">{r.courseCode}</p>
                                    </div>
                                    <Badge className="bg-teal-100 text-teal-700">{r.credits} credits</Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-2">{r.reason}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          {recs.reasoning && <p className="text-sm text-gray-500 italic border-t pt-3">{recs.reasoning}</p>}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-center py-8">No recommendations available</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
