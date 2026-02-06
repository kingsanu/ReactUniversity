"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { ArrowLeft, Mail, Phone, Calendar, Clock, Award, BookOpen, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
// Simple local skeleton component to replace missing UI component
const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("animate-pulse rounded-md bg-gray-200", className)} {...props} />
);
import { useStudent } from "@/hooks/useSchoolAdmin";
import { format } from "date-fns";
import { StudentStatus } from "@/types/student";
import { cn } from "@/lib/utils";

export default function StudentDetailsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;

  const { data: student, isLoading, error } = useStudent(studentId);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
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
          {t("schoolAdmin.students.error.description", "The student you are looking for does not exist or an error occurred.")}
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
      <Badge variant="secondary" className={cn("font-medium", styles[status] || styles.inactive)}>
        {t(`schoolAdmin.students.status.${student.status}`, student.status.charAt(0).toUpperCase() + student.status.slice(1))}
      </Badge>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
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

        {/* Header Profile */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
            <AvatarImage src={student.avatar || ""} />
            <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-3xl">
              {student.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row items-center md:items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
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
                    {t("schoolAdmin.students.joined", "Joined")}: {format(new Date(student.createdAt || student.joinedAt!), "MMM d, yyyy")}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("schoolAdmin.students.progress", "Overall Progress")}
            </CardTitle>
            <BookOpen className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student.progress}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {t("schoolAdmin.students.progressDesc", "Content completion")}
            </p>
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
            <div className="text-2xl font-bold">{student.averageScore.toFixed(1)}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {t("schoolAdmin.students.avgScoreDesc", "Across all assessments")}
            </p>
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
            <p className="text-xs text-gray-500 mt-1">
              {student.lastActive
                ? format(new Date(student.lastActive), "h:mm a")
                : "-"}
            </p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
