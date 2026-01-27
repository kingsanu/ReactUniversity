"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  FileText,
  Download,
  Eye,
  RefreshCw,
  Filter,
  Calendar,
  Award,
  Clock,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStudentResults, useStudentDetailResult } from "@/hooks/useSchoolAdmin";
import { exportResults } from "@/services/schoolAdminService";
import { toast } from "sonner";

export default function ResultsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const limit = 10;

  const { data: results, isLoading, refetch } = useStudentResults({
    page,
    limit,
    assessmentType: typeFilter !== "all" ? typeFilter : undefined,
  });

  const { data: studentDetail, isLoading: detailLoading } = useStudentDetailResult(
    selectedStudentId || "",
    !!selectedStudentId && isDetailOpen
  );

  const handleViewDetail = (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsDetailOpen(true);
  };

  const handleExport = async (format: "csv" | "pdf") => {
    try {
      const blob = await exportResults({ format });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `results.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Results exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to export results");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-50";
    if (score >= 60) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {t("schoolAdmin.results.title", "Student Results")}
            </h1>
            <p className="text-lg text-gray-500 font-medium">
              {t("schoolAdmin.results.subtitle", "View and export student assessment results.")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => handleExport("csv")}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport("pdf")}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t("schoolAdmin.results.searchPlaceholder", "Search by student name...")}
              className="pl-10"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="mr-2 h-4 w-4 text-gray-400" />
              <SelectValue placeholder="Assessment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="career">Career Assessment</SelectItem>
              <SelectItem value="skills">Skills Assessment</SelectItem>
              <SelectItem value="personality">Personality Test</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Results Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-100 overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead>Student</TableHead>
                <TableHead>Assessment</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <RefreshCw className="animate-spin h-5 w-5 text-gray-400" />
                      <span className="text-gray-500">Loading results...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : !results?.data || results.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-12 h-12 text-gray-300" />
                      <p className="text-gray-500 font-medium">No results found</p>
                      <p className="text-gray-400 text-sm">Results will appear as students complete assessments</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                results.data.map((result) => (
                  <TableRow key={result.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-medium">
                          {result.student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{result.student.name}</p>
                          <p className="text-sm text-gray-500">{result.student.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{result.assessmentName}</TableCell>
                    <TableCell>
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {result.assessmentType}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={cn("px-2.5 py-1 rounded-full text-sm font-bold", getScoreColor(result.score))}>
                        {result.score}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{result.duration} min</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">
                        {new Date(result.completedAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetail(result.student.id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {results && results.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, results.total)} of {results.total}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isLoading}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500">
                  Page {page} of {results.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= results.totalPages || isLoading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Student Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-teal-600" />
              Student Performance Detail
            </DialogTitle>
            <DialogDescription>
              Detailed assessment history and performance breakdown
            </DialogDescription>
          </DialogHeader>

          {detailLoading ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="animate-spin h-8 w-8 text-gray-400" />
            </div>
          ) : studentDetail ? (
            <div className="space-y-6">
              {/* Student Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">
                  {studentDetail.student.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{studentDetail.student.name}</p>
                  <p className="text-gray-500">{studentDetail.student.email}</p>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-teal-600">{studentDetail.summary.totalAssessments}</p>
                  <p className="text-sm text-gray-500">Assessments</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-violet-600">{studentDetail.summary.averageScore.toFixed(1)}%</p>
                  <p className="text-sm text-gray-500">Avg. Score</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-amber-600">{studentDetail.summary.totalTimeSpent}m</p>
                  <p className="text-sm text-gray-500">Time Spent</p>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-xl">
                  <p className="font-semibold text-emerald-700 mb-2">Strong Areas</p>
                  <ul className="space-y-1">
                    {studentDetail.summary.strongAreas.map((area, i) => (
                      <li key={i} className="text-sm text-emerald-600 flex items-center gap-2">
                        <Target className="w-3 h-3" /> {area}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl">
                  <p className="font-semibold text-amber-700 mb-2">Areas for Improvement</p>
                  <ul className="space-y-1">
                    {studentDetail.summary.improvementAreas.map((area, i) => (
                      <li key={i} className="text-sm text-amber-600 flex items-center gap-2">
                        <Target className="w-3 h-3" /> {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Assessment List */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Assessment History</h4>
                <div className="space-y-3">
                  {studentDetail.assessments.map((assessment) => (
                    <div key={assessment.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">{assessment.name}</p>
                        <p className="text-sm text-gray-500">{new Date(assessment.completedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className={cn("text-lg font-bold", assessment.score >= 80 ? "text-emerald-600" : assessment.score >= 60 ? "text-amber-600" : "text-red-600")}>
                          {assessment.score}%
                        </p>
                        <p className="text-xs text-gray-500">{assessment.duration} min</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No details available</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
