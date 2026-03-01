"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Mail,
  Calendar,
  Clock,
  Award,
  BookOpen,
  AlertCircle,
  GraduationCap,
  Target,
  FileText,
  MessageSquare,
  TrendingUp,
  Plus,
  Send,
  Trash2,
  ChevronDown,
  Heart,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InviteParentPanel } from "@/components/school-admin/InviteParentPanel";
import { SequenceBuilder } from "@/components/course-plan/SequenceBuilder";
import { useStudent } from "@/hooks/useSchoolAdmin";
import {
  useStudentCoursePlan,
  useSchoolAdminAddCourse,
  useSchoolAdminRemoveCourse,
  useSchoolAdminStudentChangeRequests,
  useSchoolAdminReviewChangeRequest,
} from "@/hooks/useCoursePlanQueries";
import {
  useStudentNotes,
  useCreateNote,
  useDeleteNote,
} from "@/hooks/useCounselorNotesQueries";
import {
  useStudentCommunityService,
  useVerifyCommunityServiceEntry,
} from "@/hooks/useCommunityServiceQueries";

import { format } from "date-fns";
import { toast } from "sonner";
import { StudentStatus } from "@/types/student";
import { cn } from "@/lib/utils";
import type { NoteType, CounselorNote } from "@/types/counselorNotes";
import type { CommunityServiceStatus } from "@/types/communityService";

export default function StudentDetailsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;

  const { data: student, isLoading, error } = useStudent(studentId);
  const { data: coursePlan } = useStudentCoursePlan(studentId);
  const { data: notesData } = useStudentNotes(studentId);
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();
  const { data: csData } = useStudentCommunityService(studentId);
  const verifyEntry = useVerifyCommunityServiceEntry();


  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState<NoteType>("general");

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Button variant="ghost" disabled>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("common.back", "Back")}
        </Button>
        <div className="flex items-center gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12 space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-red-100 rounded-full">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {t("schoolAdmin.students.error.title", "Student not found")}
        </h2>
        <p className="text-gray-500">
          {t(
            "schoolAdmin.students.error.description",
            "The student you are looking for does not exist or an error occurred."
          )}
        </p>
        <Button onClick={() => router.push("/school-admin/students")}>
          {t("schoolAdmin.students.backToList", "Back to Students")}
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: StudentStatus) => {
    const styles = {
      active: "bg-emerald-100 text-emerald-700",
      pending: "bg-amber-100 text-amber-700",
      accepted: "bg-blue-100 text-blue-700",
      inactive: "bg-gray-100 text-gray-700",
    };
    return (
      <Badge
        variant="secondary"
        className={cn("font-medium", styles[status] || styles.inactive)}
      >
        {t(
          `schoolAdmin.students.status.${student.status}`,
          student.status.charAt(0).toUpperCase() + student.status.slice(1)
        )}
      </Badge>
    );
  };

  const plan = coursePlan?.plan;
  const notes = notesData?.data || [];

  const adminAdd = useSchoolAdminAddCourse(studentId);
  const adminRemove = useSchoolAdminRemoveCourse(studentId);
  const { data: changeRequestsData } = useSchoolAdminStudentChangeRequests(studentId, "pending");
  const reviewRequest = useSchoolAdminReviewChangeRequest(studentId);
  const pendingRequests = changeRequestsData?.data ?? [];

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    createNote.mutate(
      { studentId, type: noteType, content: newNote, isPrivate: false },
      {
        onSuccess: () => setNewNote(""),
        onError: (err: Error) => toast.error(err.message),
      }
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Back button + Profile header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Button
          variant="ghost"
          className="mb-6 hover:bg-gray-100"
          onClick={() => router.push("/school-admin/students")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("schoolAdmin.students.backToList", "Back to Students")}
        </Button>

        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
            <AvatarImage src={student.avatar || ""} />
            <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-3xl">
              {student.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">
                {student.name}
              </h1>
              {getStatusBadge(student.status)}
            </div>
            <div className="flex flex-col md:flex-row gap-4 text-gray-500 pt-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                {student.email}
              </div>
              {(student.createdAt || student.joinedAt) && (
                <>
                  <span className="hidden md:inline text-gray-300">|</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {t("schoolAdmin.students.joined", "Joined")}:{" "}
                    {format(
                      new Date(student.createdAt || student.joinedAt!),
                      "MMM d, yyyy"
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("schoolAdmin.students.progress", "Overall Progress")}
            </CardTitle>
            <BookOpen className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student.progress}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("schoolAdmin.students.avgScore", "Average Score")}
            </CardTitle>
            <Award className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {student.averageScore.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("schoolAdmin.students.credits", "Credits")}
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {plan?.graduationProgress?.totalCreditsEarned ?? "—"}/
              {plan?.graduationProgress?.totalCreditsRequired ?? "—"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("schoolAdmin.students.lastActive", "Last Active")}
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {student.lastActive
                ? format(new Date(student.lastActive), "MMM d")
                : t("schoolAdmin.students.never", "Never")}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Detail Sections */}
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">
            {t("schoolAdmin.students.tabs.overview", "Overview")}
          </TabsTrigger>
          <TabsTrigger value="courses">
            {t("schoolAdmin.students.tabs.courses", "Courses")}
          </TabsTrigger>
          <TabsTrigger value="assessments">
            {t("schoolAdmin.students.tabs.assessments", "Assessments")}
          </TabsTrigger>
          <TabsTrigger value="notes">
            {t("schoolAdmin.students.tabs.notes", "Counselor Notes")}
          </TabsTrigger>
          <TabsTrigger value="graduation">
            {t("schoolAdmin.students.tabs.graduation", "Graduation")}
          </TabsTrigger>
          <TabsTrigger value="parents">
            {t("schoolAdmin.students.tabs.parents", "Parents & Guardians")}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Graduation Progress */}
          {plan?.graduationProgress && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <GraduationCap className="h-5 w-5 text-indigo-600" />
                  {t("schoolAdmin.students.graduationProgress", "Graduation Progress")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {t("schoolAdmin.students.creditsProgress", "Credit Progress")}
                  </span>
                  <span className="font-medium">
                    {plan.graduationProgress.totalCreditsEarned}/
                    {plan.graduationProgress.totalCreditsRequired}
                  </span>
                </div>
                <Progress
                  value={
                    plan.graduationProgress.totalCreditsRequired
                      ? (plan.graduationProgress.totalCreditsEarned /
                        plan.graduationProgress.totalCreditsRequired) *
                      100
                      : 0
                  }
                  className="h-3"
                />
                <Badge
                  variant="secondary"
                  className={
                    plan.graduationProgress.isOnTrack
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {plan.graduationProgress.isOnTrack
                    ? t("schoolAdmin.students.onTrack", "On Track")
                    : t("schoolAdmin.students.atRisk", "At Risk")}
                </Badge>
              </CardContent>
            </Card>
          )}

          {/* Career Path */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-5 w-5 text-purple-600" />
                {t("schoolAdmin.students.careerPath", "Career Path & Interests")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-sm">
                {t(
                  "schoolAdmin.students.careerPathDesc",
                  "Career assessment and interest data will appear here once available from the assessment system."
                )}
              </p>
            </CardContent>
          </Card>

          {/* 360 Evaluation Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5 text-teal-600" />
                {t("schoolAdmin.students.evaluationStatus", "360° Evaluation Status")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-sm">
                {t(
                  "schoolAdmin.students.evaluationStatusDesc",
                  "360-degree evaluation results and status will be displayed here."
                )}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => router.push("/school-admin/evaluations")}
              >
                {t("schoolAdmin.students.viewEvaluations", "View All Evaluations")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="mt-6 space-y-6">
          {/* Pending change requests */}
          {pendingRequests.length > 0 && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-amber-800">
                  <AlertCircle className="h-5 w-5" />
                  {t("schoolAdmin.students.pendingRequests", "Pending Change Requests")} ({pendingRequests.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between bg-white rounded-lg p-3 border border-amber-100 gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {req.action === "add" ? "+" : "−"} {req.courseName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {req.courseCode} · Grade {req.gradeLevel} · {req.semester}
                      </p>
                      {req.studentNote && (
                        <p className="text-xs text-gray-600 mt-1 italic">"{req.studentNote}"</p>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        disabled={reviewRequest.isPending}
                        onClick={() =>
                          reviewRequest.mutate({
                            requestId: req.id,
                            payload: { status: "approved" },
                          })
                        }
                      >
                        {t("common.approve", "Approve")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        disabled={reviewRequest.isPending}
                        onClick={() =>
                          reviewRequest.mutate({
                            requestId: req.id,
                            payload: { status: "rejected" },
                          })
                        }
                      >
                        {t("common.reject", "Reject")}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Sequence Builder */}
          <SequenceBuilder
            planData={coursePlan}
            isLoading={false}
            mode="counselor"
            onCounselorAdd={(payload) => adminAdd.mutate(payload)}
            onCounselorRemove={(enrollmentId) => adminRemove.mutate(enrollmentId)}
            isCounselorAddPending={adminAdd.isPending}
            isCounselorRemovePending={adminRemove.isPending}
          />
        </TabsContent>

        {/* Assessments Tab */}
        <TabsContent value="assessments" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5 text-indigo-600" />
                {t("schoolAdmin.students.assessmentResults", "Assessment Results")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-indigo-50 rounded-lg text-center">
                  <p className="text-sm text-indigo-600 font-medium">LIA Score</p>
                  <p className="text-2xl font-bold text-indigo-900">—</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <p className="text-sm text-purple-600 font-medium">PCA Score</p>
                  <p className="text-2xl font-bold text-purple-900">—</p>
                </div>
                <div className="p-4 bg-teal-50 rounded-lg text-center">
                  <p className="text-sm text-teal-600 font-medium">MIL Score</p>
                  <p className="text-2xl font-bold text-teal-900">—</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm text-center">
                {t(
                  "schoolAdmin.students.assessmentDesc",
                  "Detailed assessment breakdown will be fetched from the student results endpoint."
                )}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Counselor Notes Tab */}
        <TabsContent value="notes" className="mt-6 space-y-6">
          {/* Add Note Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-5 w-5 text-emerald-600" />
                {t("schoolAdmin.students.addNote", "Add Note")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <Select
                  value={noteType}
                  onValueChange={(v) => setNoteType(v as NoteType)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="follow_up">Follow Up</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="career">Career</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder={t(
                  "schoolAdmin.students.notePlaceholder",
                  "Type your note here..."
                )}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
              />
              <Button
                onClick={handleAddNote}
                disabled={!newNote.trim() || createNote.isPending}
                size="sm"
              >
                <Send className="mr-2 h-4 w-4" />
                {t("schoolAdmin.students.saveNote", "Save Note")}
              </Button>
            </CardContent>
          </Card>

          {/* Notes List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {t("schoolAdmin.students.noteHistory", "Note History")} (
                {notes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {t("schoolAdmin.students.noNotes", "No counselor notes yet.")}
                </p>
              ) : (
                <div className="space-y-4">
                  {notes.map((note: CounselorNote) => (
                    <div
                      key={note.id}
                      className="p-4 border rounded-lg space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {note.type}
                          </Badge>
                          {note.isPrivate && (
                            <Badge
                              variant="secondary"
                              className="bg-amber-100 text-amber-700 text-xs"
                            >
                              Private
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          {note.createdAt &&
                            format(new Date(note.createdAt), "MMM d, yyyy h:mm a")}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                            onClick={() =>
                              deleteNote.mutate({
                                noteId: note.id,
                                studentId,
                              })
                            }
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {note.content}
                      </p>
                      {note.followUpDate && (
                        <p className="text-xs text-amber-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Follow-up:{" "}
                          {format(new Date(note.followUpDate), "MMM d, yyyy")}
                        </p>
                      )}
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {note.tags.map((tag: string) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs bg-gray-100"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        {/* Graduation Tab */}
        <TabsContent value="graduation" className="mt-6 space-y-6">
          {/* Community Service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Heart className="h-5 w-5 text-pink-600" />
                Community Service Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Verified Hours</span>
                <span className="font-medium">
                  {csData?.totalHoursVerified ?? 0} / {csData?.totalHoursRequired ?? 40}
                </span>
              </div>
              <Progress
                value={
                  (csData?.totalHoursRequired ?? 40) > 0
                    ? ((csData?.totalHoursVerified ?? 0) / (csData?.totalHoursRequired ?? 40)) * 100
                    : 0
                }
                className="h-3"
              />

              {/* Entries */}
              {csData?.entries && csData.entries.length > 0 ? (
                <div className="space-y-3 mt-4">
                  {csData.entries.map((entry) => {
                    const isPending = entry.status === "pending";
                    return (
                      <div
                        key={entry.id}
                        className={cn(
                          "p-3 rounded-lg border flex items-start justify-between gap-3",
                          entry.status === "verified" && "bg-emerald-50 border-emerald-200",
                          entry.status === "pending" && "bg-amber-50 border-amber-200",
                          entry.status === "rejected" && "bg-red-50 border-red-200"
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{entry.organization}</p>
                          <p className="text-xs text-gray-500">
                            {entry.hours}h · {format(new Date(entry.date), "MMM d, yyyy")}
                          </p>
                          {entry.description && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-1">{entry.description}</p>
                          )}
                        </div>
                        {isPending ? (
                          <div className="flex gap-1.5 shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                              disabled={verifyEntry.isPending}
                              onClick={() =>
                                verifyEntry.mutate({ entryId: entry.id, payload: { status: "verified" } })
                              }
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Verify
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-xs border-red-300 text-red-700 hover:bg-red-100"
                              disabled={verifyEntry.isPending}
                              onClick={() =>
                                verifyEntry.mutate({ entryId: entry.id, payload: { status: "rejected" } })
                              }
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs shrink-0",
                              entry.status === "verified" && "bg-emerald-100 text-emerald-700",
                              entry.status === "rejected" && "bg-red-100 text-red-700"
                            )}
                          >
                            {entry.status === "verified" ? "Verified" : "Rejected"}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">
                  No community service entries logged yet.
                </p>
              )}
            </CardContent>
          </Card>


        </TabsContent>

        {/* Parents & Guardians Tab */}
        <TabsContent value="parents" className="mt-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <InviteParentPanel
              studentId={studentId}
              studentName={student.name}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
