"use client";

import { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Send,
  X,
  LoaderCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type {
  StudentCoursePlanResponse,
  StudentCourseEnrollment,
  CourseChangeRequest,
} from "@/types/coursePlan";

// ─── Types ───────────────────────────────────────────────────────────────────

type Mode = "student" | "counselor";

interface AddCourseForm {
  courseId: string;
  courseCode: string;
  courseName: string;
  credits: number;
  gradeLevel: number;
  semester: string;
  studentNote: string;
}

interface SequenceBuilderProps {
  planData: StudentCoursePlanResponse | undefined;
  isLoading: boolean;
  mode: Mode;
  // Counselor direct edit callbacks
  onCounselorAdd?: (payload: {
    courseId: string;
    gradeLevel: number;
    semester: string;
    courseCode: string;
    courseName: string;
    credits: number;
  }) => void;
  onCounselorRemove?: (enrollmentId: string) => void;
  isCounselorAddPending?: boolean;
  isCounselorRemovePending?: boolean;
  // Student request callbacks
  onSubmitRequest?: (payload: {
    courseId: string;
    courseCode: string;
    courseName: string;
    credits: number;
    gradeLevel: number;
    semester: string;
    action: "add" | "remove";
    studentNote?: string;
  }) => void;
  onCancelRequest?: (requestId: string) => void;
  isSubmitPending?: boolean;
  // Pending change requests (shown only in student mode)
  pendingRequests?: CourseChangeRequest[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const GRADE_LABELS: Record<number, string> = {
  9: "Grade 9 — Freshman",
  10: "Grade 10 — Sophomore",
  11: "Grade 11 — Junior",
  12: "Grade 12 — Senior",
};

const SEMESTERS = ["Fall", "Spring", "Summer"];

const STATUS_COLORS: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  in_progress: "bg-blue-100 text-blue-700 border-blue-200",
  planned: "bg-gray-100 text-gray-600 border-gray-200",
  dropped: "bg-red-100 text-red-600 border-red-200",
  pending_add: "bg-amber-100 text-amber-700 border-amber-200",
  pending_remove: "bg-orange-100 text-orange-700 border-orange-200",
};

const STATUS_ICONS: Record<string, typeof CheckCircle2> = {
  completed: CheckCircle2,
  in_progress: Clock,
  planned: BookOpen,
  dropped: AlertTriangle,
};

const REQUEST_STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
};

// ─── Cell: list of courses in one grade+semester slot ────────────────────────

interface CourseCellProps {
  courses: StudentCourseEnrollment[];
  pendingCourseIds: Set<string>; // courseIds with pending remove requests
  mode: Mode;
  onRemove: (course: StudentCourseEnrollment) => void;
  isRemovePending: boolean;
}

function CourseCell({
  courses,
  pendingCourseIds,
  mode,
  onRemove,
  isRemovePending,
}: CourseCellProps) {
  if (courses.length === 0) {
    return (
      <p className="text-xs text-gray-400 italic py-2 px-1">No courses</p>
    );
  }

  return (
    <div className="space-y-1.5">
      {courses.map((c) => {
        const Icon = STATUS_ICONS[c.status] ?? BookOpen;
        const hasPendingRemove = pendingCourseIds.has(c.courseId);
        return (
          <div
            key={c.id}
            className={cn(
              "flex items-start justify-between gap-1 p-2 rounded-lg border text-xs group",
              hasPendingRemove
                ? STATUS_COLORS["pending_remove"]
                : STATUS_COLORS[c.status] || STATUS_COLORS["planned"]
            )}
          >
            <div className="flex items-start gap-1.5 min-w-0">
              <Icon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium truncate leading-tight">{c.courseName}</p>
                <p className="text-[10px] opacity-70 mt-0.5">
                  {c.courseCode} · {c.credits} cr
                  {c.grade ? ` · ${c.grade}` : ""}
                  {hasPendingRemove ? " · removal pending" : ""}
                </p>
              </div>
            </div>
            {/* Remove button — only for planned courses that don't already have pending remove */}
            {c.status === "planned" && !hasPendingRemove && (
              <button
                onClick={() => onRemove(c)}
                disabled={isRemovePending}
                className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-current hover:text-red-600"
                title={
                  mode === "counselor"
                    ? "Remove course"
                    : "Request removal"
                }
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main SequenceBuilder component ──────────────────────────────────────────

export function SequenceBuilder({
  planData,
  isLoading,
  mode,
  onCounselorAdd,
  onCounselorRemove,
  isCounselorAddPending,
  isCounselorRemovePending,
  onSubmitRequest,
  onCancelRequest,
  isSubmitPending,
  pendingRequests,
}: SequenceBuilderProps) {
  const [expandedGrades, setExpandedGrades] = useState<number[]>([9, 10, 11, 12]);
  const [addDialog, setAddDialog] = useState<{
    open: boolean;
    gradeLevel: number;
    semester: string;
  }>({ open: false, gradeLevel: 9, semester: "Fall" });
  const [addForm, setAddForm] = useState<AddCourseForm>({
    courseId: "",
    courseCode: "",
    courseName: "",
    credits: 1,
    gradeLevel: 9,
    semester: "Fall",
    studentNote: "",
  });
  const [removeNoteDialog, setRemoveNoteDialog] = useState<{
    open: boolean;
    course: StudentCourseEnrollment | null;
    note: string;
  }>({ open: false, course: null, note: "" });

  const plan = planData?.plan;
  const gradProg = plan?.graduationProgress;

  // Build lookup: courseId → set for pending removes
  const pendingRemoveCourseIds = new Set<string>(
    (pendingRequests ?? [])
      .filter((r) => r.action === "remove" && r.status === "pending")
      .map((r) => r.courseId)
  );

  // Group enrollments by gradeLevel+semester
  const getBySemester = (
    grade: number,
    semester: string
  ): StudentCourseEnrollment[] => {
    if (!plan?.enrollments) return [];
    return plan.enrollments.filter(
      (e) =>
        e.gradeLevel === grade &&
        e.semester.toLowerCase().startsWith(semester.toLowerCase())
    );
  };

  const toggleGrade = (g: number) =>
    setExpandedGrades((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );

  const creditPercent =
    gradProg && gradProg.totalCreditsRequired > 0
      ? Math.round(
          (gradProg.totalCreditsEarned / gradProg.totalCreditsRequired) * 100
        )
      : 0;

  // ── Handle add ────────────────────────────────────────────────────────────
  const openAddDialog = (gradeLevel: number, semester: string) => {
    setAddForm({
      courseId: "",
      courseCode: "",
      courseName: "",
      credits: 1,
      gradeLevel,
      semester,
      studentNote: "",
    });
    setAddDialog({ open: true, gradeLevel, semester });
  };

  const handleAdd = () => {
    if (!addForm.courseName.trim()) return;
    const payload = {
      courseId: addForm.courseId.trim() || crypto.randomUUID(),
      courseCode: addForm.courseCode.trim(),
      courseName: addForm.courseName.trim(),
      credits: addForm.credits,
      gradeLevel: addForm.gradeLevel,
      semester: addForm.semester,
    };
    if (mode === "counselor") {
      onCounselorAdd?.(payload);
    } else {
      onSubmitRequest?.({
        ...payload,
        action: "add",
        studentNote: addForm.studentNote.trim() || undefined,
      });
    }
    setAddDialog({ open: false, gradeLevel: 9, semester: "Fall" });
  };

  // ── Handle remove ─────────────────────────────────────────────────────────
  const handleRemoveClick = (course: StudentCourseEnrollment) => {
    if (mode === "counselor") {
      onCounselorRemove?.(course.id);
    } else {
      setRemoveNoteDialog({ open: true, course, note: "" });
    }
  };

  const confirmRemoveRequest = () => {
    const { course, note } = removeNoteDialog;
    if (!course) return;
    onSubmitRequest?.({
      courseId: course.courseId,
      courseCode: course.courseCode,
      courseName: course.courseName,
      credits: course.credits,
      gradeLevel: course.gradeLevel,
      semester: course.semester,
      action: "remove",
      studentNote: note.trim() || undefined,
    });
    setRemoveNoteDialog({ open: false, course: null, note: "" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400">
        <LoaderCircle className="h-6 w-6 animate-spin mr-2" />
        Loading course plan…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Graduation progress bar ──────────────────────────────────────── */}
      {gradProg && (
        <div className="p-4 rounded-xl border bg-gradient-to-r from-indigo-50 to-violet-50 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2.5 bg-indigo-100 rounded-xl">
              <GraduationCap className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                Graduation Progress
              </p>
              <p className="text-xs text-gray-500">
                {gradProg.totalCreditsEarned} / {gradProg.totalCreditsRequired}{" "}
                credits earned
              </p>
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <Progress value={creditPercent} className="h-2.5" />
            <p className="text-xs text-right text-gray-400">{creditPercent}%</p>
          </div>
          <Badge
            className={cn(
              "text-xs",
              gradProg.isOnTrack
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            )}
          >
            {gradProg.isOnTrack ? "On Track" : "At Risk"}
          </Badge>
        </div>
      )}

      {/* ── Grade rows ───────────────────────────────────────────────────── */}
      {[9, 10, 11, 12].map((grade) => {
        const allCourses = plan?.enrollments?.filter(
          (e) => e.gradeLevel === grade
        ) ?? [];
        const totalCredits = allCourses.reduce((s, c) => s + (c.credits || 0), 0);
        const completedCount = allCourses.filter(
          (c) => c.status === "completed"
        ).length;
        const isExpanded = expandedGrades.includes(grade);

        return (
          <div key={grade} className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Grade header */}
            <button
              onClick={() => toggleGrade(grade)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
                <span className="font-semibold text-sm text-gray-800">
                  {GRADE_LABELS[grade] || `Grade ${grade}`}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {allCourses.length} courses · {totalCredits} credits ·{" "}
                {completedCount}/{allCourses.length} completed
              </span>
            </button>

            {/* Semester columns */}
            {isExpanded && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                {SEMESTERS.map((sem) => {
                  const semCourses = getBySemester(grade, sem);
                  return (
                    <div key={sem} className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {sem}
                        </h4>
                        <button
                          onClick={() => openAddDialog(grade, sem)}
                          className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium"
                          title={
                            mode === "counselor"
                              ? "Add course directly"
                              : "Request to add a course"
                          }
                        >
                          <Plus className="h-3.5 w-3.5" />
                          {mode === "counselor" ? "Add" : "Request"}
                        </button>
                      </div>
                      <CourseCell
                        courses={semCourses}
                        pendingCourseIds={pendingRemoveCourseIds}
                        mode={mode}
                        onRemove={handleRemoveClick}
                        isRemovePending={!!isCounselorRemovePending}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* ── Empty state ─────────────────────────────────────────────────── */}
      {!isLoading && !plan && (
        <div className="text-center py-16 text-gray-400">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No course plan available yet.</p>
        </div>
      )}

      {/* ── Pending requests list (student mode summary) ─────────────────*/}
      {mode === "student" && pendingRequests && pendingRequests.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-amber-800">
            Pending Change Requests ({pendingRequests.filter((r) => r.status === "pending").length})
          </h3>
          <div className="space-y-2">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between bg-white rounded-lg border border-amber-100 px-3 py-2 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Badge
                    className={cn(
                      "text-[10px]",
                      REQUEST_STATUS_COLORS[req.status]
                    )}
                  >
                    {req.action} · {req.status}
                  </Badge>
                  <span className="font-medium truncate">{req.courseName}</span>
                  <span className="text-gray-400">
                    Gr.{req.gradeLevel} · {req.semester}
                  </span>
                </div>
                {req.status === "pending" && onCancelRequest && (
                  <button
                    onClick={() => onCancelRequest(req.id)}
                    className="ml-2 text-gray-400 hover:text-red-500 flex-shrink-0"
                    title="Cancel request"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                {req.status !== "pending" && req.counselorNote && (
                  <span className="text-gray-400 ml-2 truncate max-w-[120px]" title={req.counselorNote}>
                    "{req.counselorNote}"
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Add course dialog ────────────────────────────────────────────── */}
      <Dialog
        open={addDialog.open}
        onOpenChange={(o) => setAddDialog((d) => ({ ...d, open: o }))}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {mode === "counselor" ? "Add Course" : "Request to Add Course"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Grade Level</Label>
                <Select
                  value={String(addForm.gradeLevel)}
                  onValueChange={(v) =>
                    setAddForm((f) => ({ ...f, gradeLevel: Number(v) }))
                  }
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[9, 10, 11, 12].map((g) => (
                      <SelectItem key={g} value={String(g)}>
                        Grade {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Semester</Label>
                <Select
                  value={addForm.semester}
                  onValueChange={(v) => setAddForm((f) => ({ ...f, semester: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SEMESTERS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Course Name *</Label>
              <Input
                value={addForm.courseName}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, courseName: e.target.value }))
                }
                placeholder="e.g. Pre-Calculus"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Course Code</Label>
                <Input
                  value={addForm.courseCode}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, courseCode: e.target.value }))
                  }
                  placeholder="e.g. MATH-301"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Credits</Label>
                <Input
                  type="number"
                  min={0.5}
                  step={0.5}
                  value={addForm.credits}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, credits: Number(e.target.value) }))
                  }
                />
              </div>
            </div>

            {mode === "student" && (
              <div className="space-y-1.5">
                <Label className="text-xs">Note to counselor (optional)</Label>
                <Textarea
                  value={addForm.studentNote}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, studentNote: e.target.value }))
                  }
                  placeholder="Why are you requesting this course?"
                  rows={2}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddDialog((d) => ({ ...d, open: false }))}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={
                !addForm.courseName.trim() ||
                isSubmitPending ||
                isCounselorAddPending
              }
              className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
            >
              {isSubmitPending || isCounselorAddPending ? (
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
              ) : mode === "counselor" ? (
                <Plus className="h-3.5 w-3.5" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              {mode === "counselor" ? "Add Course" : "Submit Request"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Remove request note dialog (student only) ────────────────────── */}
      <Dialog
        open={removeNoteDialog.open}
        onOpenChange={(o) =>
          setRemoveNoteDialog((d) => ({ ...d, open: o }))
        }
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Request Course Removal</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {removeNoteDialog.course && (
              <p className="text-sm text-gray-600">
                Requesting removal of{" "}
                <span className="font-semibold">
                  {removeNoteDialog.course.courseName}
                </span>{" "}
                from your plan. Your counselor will review this.
              </p>
            )}
            <div className="space-y-1.5">
              <Label className="text-xs">Note to counselor (optional)</Label>
              <Textarea
                value={removeNoteDialog.note}
                onChange={(e) =>
                  setRemoveNoteDialog((d) => ({ ...d, note: e.target.value }))
                }
                placeholder="Reason for removing this course…"
                rows={2}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setRemoveNoteDialog({ open: false, course: null, note: "" })
              }
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={confirmRemoveRequest}
              disabled={isSubmitPending}
              className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
            >
              {isSubmitPending && (
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
              )}
              <Send className="h-3.5 w-3.5" />
              Submit Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
